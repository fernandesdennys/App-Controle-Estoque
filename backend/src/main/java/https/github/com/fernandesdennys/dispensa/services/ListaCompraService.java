package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.ListaCompraMapper;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraGerarDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ListaCompraItemUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.ListaCompra;
import https.github.com.fernandesdennys.dispensa.entities.ListaCompraItem;
import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.StatusListaCompra;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import https.github.com.fernandesdennys.dispensa.exception.ListaJaFinalizadaException;
import https.github.com.fernandesdennys.dispensa.exception.ListaVaziaException;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.ListaCompraItemRepository;
import https.github.com.fernandesdennys.dispensa.repositories.ListaCompraRepository;
import https.github.com.fernandesdennys.dispensa.repositories.MovimentacaoRepository;
import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ListaCompraService {

    @Autowired
    private ListaCompraRepository listaCompraRepository;

    @Autowired
    private ListaCompraItemRepository listaCompraItemRepository;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private MovimentacaoRepository movimentacaoRepository;

    @Autowired
    private ListaCompraMapper mapper;


    @Transactional
    public ListaCompraDTO gerar(ListaCompraGerarDTO dto) {

        List<Produto> produtosAbaixoMinimo =
                produtoRepository.buscarProdutosAbaixoDoMinimo();

        if (produtosAbaixoMinimo.isEmpty()) {

            throw new ListaVaziaException(
                    "Nenhum produto está abaixo do estoque mínimo no momento"
            );
        }

        ListaCompra lista = new ListaCompra();

        lista.setTitulo(dto.titulo());
        lista.setStatus(StatusListaCompra.ABERTA);

        for (Produto produto : produtosAbaixoMinimo) {

            ListaCompraItem item =
                    new ListaCompraItem();

            item.setListaCompra(lista);
            item.setProduto(produto);

            item.setQuantidadeSugerida(
                    produto.getQuantidadeIdeal()
                            .subtract(produto.getQuantidadeAtual())
            );

            item.setComprado(false);

            // Cascade ALL persiste os itens junto com a lista.
            lista.getItens().add(item);
        }

        lista =
                listaCompraRepository.save(lista);

        return mapper.toDTO(lista);
    }


    // ============================================================
    // BUSCAR LISTA POR ID
    // ============================================================
    //
    // GET /listas/{id}
    // ============================================================

    @Transactional(readOnly = true)
    public ListaCompraDTO buscarPorId(Integer id) {

        ListaCompra lista =
                listaCompraRepository
                        .buscarPorIdComItens(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Lista não encontrada: id " + id
                                )
                        );

        return mapper.toDTO(lista);
    }

    @Transactional
    public ListaCompraDTO atualizarItem(
            Integer listaId,
            Long itemId,
            ListaCompraItemUpdateDTO dto
    ) {

        listaCompraItemRepository
                .buscarItemDaLista(listaId, itemId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Item "
                                        + itemId
                                        + " não encontrado na lista "
                                        + listaId
                        )
                );

        int linhasAfetadas =
                listaCompraItemRepository.atualizarItem(
                        listaId,
                        itemId,
                        dto.quantidadeComprada(),
                        dto.comprado()
                );

        if (linhasAfetadas == 0) {

            throw new ResourceNotFoundException(
                    "Item "
                            + itemId
                            + " não encontrado na lista "
                            + listaId
            );
        }

        return buscarPorId(listaId);
    }

    @Transactional
    public ListaCompraDTO finalizar(Integer id) {

        ListaCompra lista =
                listaCompraRepository
                        .buscarPorIdComItens(id)
                        .orElseThrow(
                                () -> new ResourceNotFoundException(
                                        "Lista não encontrada: id " + id
                                )
                        );

        if (lista.getStatus() != StatusListaCompra.ABERTA) {

            throw new ListaJaFinalizadaException(
                    "Lista "
                            + id
                            + " já está finalizada ou cancelada"
            );
        }

        List<ListaCompraItem> itensComprados =
                listaCompraItemRepository
                        .buscarItensCompradosDaLista(id);

        for (ListaCompraItem item : itensComprados) {

            BigDecimal quantidade =
                    item.getQuantidadeComprada() != null
                            ? item.getQuantidadeComprada()
                            : item.getQuantidadeSugerida();

            Produto produto = item.getProduto();

            int resultado =
                    produtoRepository.adicionarEntrada(
                            produto.getId(),
                            quantidade,
                            LocalDateTime.now()
                    );

            if (resultado == 0) {

                throw new ResourceNotFoundException(
                        "Produto não encontrado: id "
                                + produto.getId()
                );
            }

            Movimentacao movimentacao =
                    new Movimentacao();

            movimentacao.setProduto(produto);
            movimentacao.setTipo(
                    TipoMovimentacao.ENTRADA
            );

            movimentacao.setQuantidade(
                    quantidade
            );

            movimentacao.setObservacao(
                    "Compra via lista #" + id
            );

            movimentacaoRepository.save(
                    movimentacao
            );
        }


        int linhasAfetadas =
                listaCompraRepository.finalizar(
                        id,
                        StatusListaCompra.FINALIZADA,
                        LocalDateTime.now()
                );

        if (linhasAfetadas == 0) {

            throw new ListaJaFinalizadaException(
                    "Lista "
                            + id
                            + " já está finalizada ou cancelada"
            );
        }

        return buscarPorId(id);
    }


    @Transactional
    public ListaCompraDTO cancelar(Integer id) {

        int linhasAfetadas =
                listaCompraRepository.cancelar(id);

        if (linhasAfetadas == 0) {

            throw new ResourceNotFoundException(
                    "Lista não encontrada ou já finalizada/cancelada: id "
                            + id
            );
        }

        return buscarPorId(id);
    }


    @Transactional(readOnly = true)
    public List<ListaCompraDTO> listar(
            StatusListaCompra status
    ) {

        return listaCompraRepository
                .buscarTodas(status)
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
}