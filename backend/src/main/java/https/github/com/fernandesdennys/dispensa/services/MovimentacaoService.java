package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.MovimentacaoMapper;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoInsertDTO;
import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import https.github.com.fernandesdennys.dispensa.exception.EstoqueInsuficienteException;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.MovimentacaoRepository;
import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;
import https.github.com.fernandesdennys.dispensa.utils.OrdenacaoWhitelist;
import https.github.com.fernandesdennys.dispensa.utils.PaginacaoUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class MovimentacaoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private MovimentacaoMapper mapper;


    // ============================================================
    // NOVA ENTRADA
    // ============================================================

    @Transactional
    public MovimentacaoDTO registrarEntrada(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        Produto produto = buscarProduto(produtoId);

        if (dto.quantidade() == null ||
                dto.quantidade().compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "A quantidade deve ser maior que zero"
            );
        }

        /*
         * Se o produto estiver inativo:
         *
         * - reativa o produto
         * - soma a quantidade recebida
         *
         * O método adicionarEntrada() já faz as duas coisas.
         */
        if (!produto.getAtivo()) {

            int linhasAfetadas =
                    produtoRepository.adicionarEntrada(
                            produto.getId(),
                            dto.quantidade(),
                            LocalDateTime.now()
                    );

            if (linhasAfetadas == 0) {
                throw new ResourceNotFoundException(
                        "Produto não encontrado: id " + produtoId
                );
            }

        } else {

            /*
             * Produto já está ativo.
             *
             * Apenas soma a nova entrada à quantidade atual.
             */
            BigDecimal quantidadeNova =
                    produto.getQuantidadeAtual()
                            .add(dto.quantidade());

            int linhasAfetadas =
                    produtoRepository.atualizarQuantidade(
                            produto.getId(),
                            quantidadeNova,
                            LocalDateTime.now()
                    );

            if (linhasAfetadas == 0) {
                throw new ResourceNotFoundException(
                        "Produto não encontrado ou inativo: id "
                                + produtoId
                );
            }
        }

        /*
         * Registra a movimentação no histórico.
         */
        Movimentacao movimentacao =
                mapper.toEntity(dto);

        movimentacao.setProduto(produto);
        movimentacao.setTipo(TipoMovimentacao.ENTRADA);

        movimentacao =
                movimentacaoRepository.save(movimentacao);

        return mapper.toDTO(movimentacao);
    }


    // ============================================================
    // CONSUMO
    // ============================================================

    @Transactional
    public MovimentacaoDTO registrarConsumo(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        return registrarSaida(
                produtoId,
                dto,
                TipoMovimentacao.SAIDA
        );
    }


    // ============================================================
    // DESCARTE
    // ============================================================

    @Transactional
    public MovimentacaoDTO registrarDescarte(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        return registrarSaida(
                produtoId,
                dto,
                TipoMovimentacao.DESCARTE
        );
    }


    // ============================================================
    // AJUSTE
    // ============================================================

    @Transactional
    public MovimentacaoDTO registrarAjuste(
            Integer produtoId,
            MovimentacaoInsertDTO dto
    ) {

        Produto produto =
                buscarProdutoAtivo(produtoId);

        BigDecimal quantidadeNova =
                dto.quantidade();

        return aplicarMovimentacao(
                produto,
                TipoMovimentacao.AJUSTE,
                dto,
                quantidadeNova
        );
    }


    // ============================================================
    // HISTÓRICO
    // ============================================================

    @Transactional(readOnly = true)
    public Page<MovimentacaoDTO> historico(
            Integer produtoId,
            TipoMovimentacao tipo,
            String ordenarPor,
            Integer page,
            Integer size
    ) {

        buscarProdutoAtivo(produtoId);

        String colunaSegura =
                OrdenacaoWhitelist
                        .resolverMovimentacao(ordenarPor);

        int pageClamped =
                PaginacaoUtil.clampPage(page);

        int sizeClamped =
                PaginacaoUtil.clampSize(size);

        Pageable pageable =
                PageRequest.of(
                        pageClamped,
                        sizeClamped,
                        Sort.unsorted()
                );

        return movimentacaoRepository
                .buscarPorProduto(
                        produtoId,
                        tipo,
                        colunaSegura,
                        pageable
                )
                .map(mapper::toDTO);
    }


    // ============================================================
    // SAÍDA
    // ============================================================

    private MovimentacaoDTO registrarSaida(
            Integer produtoId,
            MovimentacaoInsertDTO dto,
            TipoMovimentacao tipo
    ) {

        Produto produto =
                buscarProdutoAtivo(produtoId);

        BigDecimal resultante =
                produto.getQuantidadeAtual()
                        .subtract(dto.quantidade());

        if (resultante.compareTo(BigDecimal.ZERO) < 0) {

            throw new EstoqueInsuficienteException(
                    "Estoque insuficiente: disponível "
                            + produto.getQuantidadeAtual()
                            + ", solicitado "
                            + dto.quantidade()
            );
        }

        return aplicarMovimentacao(
                produto,
                tipo,
                dto,
                resultante
        );
    }


    // ============================================================
    // APLICA MOVIMENTAÇÃO
    // ============================================================

    private MovimentacaoDTO aplicarMovimentacao(
            Produto produto,
            TipoMovimentacao tipo,
            MovimentacaoInsertDTO dto,
            BigDecimal resultante
    ) {

        int linhasAfetadas =
                produtoRepository.atualizarQuantidade(
                        produto.getId(),
                        resultante,
                        LocalDateTime.now()
                );

        if (linhasAfetadas == 0) {

            throw new ResourceNotFoundException(
                    "Produto não encontrado ou inativo: id "
                            + produto.getId()
            );
        }

        Movimentacao movimentacao =
                mapper.toEntity(dto);

        movimentacao.setProduto(produto);
        movimentacao.setTipo(tipo);

        movimentacao =
                movimentacaoRepository.save(movimentacao);

        return mapper.toDTO(movimentacao);
    }


    // ============================================================
    // BUSCAR PRODUTO
    //
    // Busca produtos ativos E inativos.
    //
    // É necessário para permitir entrada em um produto
    // que foi removido do estoque.
    // ============================================================

    private Produto buscarProduto(Integer produtoId) {

        try {

            Produto produto =
                    produtoRepository.getReferenceById(produtoId);

            // Força a inicialização do proxy.
            produto.getNome();

            return produto;

        } catch (EntityNotFoundException e) {

            throw new ResourceNotFoundException(
                    "Produto não encontrado: id "
                            + produtoId
            );
        }
    }


    // ============================================================
    // BUSCAR PRODUTO ATIVO
    //
    // Usado para:
    // - consumo
    // - descarte
    // - ajuste
    // - histórico
    // ============================================================

    private Produto buscarProdutoAtivo(Integer produtoId) {

        try {

            Produto produto =
                    produtoRepository.getReferenceById(produtoId);

            // Força a inicialização do proxy.
            produto.getNome();

            if (!produto.getAtivo()) {

                throw new ResourceNotFoundException(
                        "Produto não encontrado: id "
                                + produtoId
                );
            }

            return produto;

        } catch (EntityNotFoundException e) {

            throw new ResourceNotFoundException(
                    "Produto não encontrado: id "
                            + produtoId
            );
        }
    }
}