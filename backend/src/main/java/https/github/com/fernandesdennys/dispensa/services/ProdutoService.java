package https.github.com.fernandesdennys.dispensa.services;

import https.github.com.fernandesdennys.dispensa.Mapper.ProdutoMapper;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.exception.DatabaseException;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.ProdutoRepository;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ProdutoMapper produtoMapper;


    // ============================================================
    // PRODUTOS DO ESTOQUE
    // ============================================================

    @Transactional(readOnly = true)
    public Page<ProdutoDTO> buscarProdutosPorCategoria(
            Integer categoriaId,
            Boolean abaixoMinimo,
            String busca,
            String ordenarPor,
            Pageable pageable
    ) {

        Page<Produto> produtos =
                produtoRepository.buscarProdutos(
                        categoriaId,
                        abaixoMinimo,
                        busca,
                        ordenarPor,
                        pageable
                );

        return produtos.map(produtoMapper::toDTO);
    }


    // ============================================================
    // CATÁLOGO COMPLETO
    // ============================================================

    @Transactional(readOnly = true)
    public List<ProdutoDTO> buscarCatalogo() {

        List<Produto> produtos =
                produtoRepository.buscarCatalogo();

        return produtos.stream()
                .map(produtoMapper::toDTO)
                .toList();
    }


    // ============================================================
    // PRODUTOS DISPONÍVEIS PARA NOVA ENTRADA
    // ============================================================

    @Transactional(readOnly = true)
    public List<ProdutoDTO> buscarProdutosDisponiveisParaEntrada() {

        List<Produto> produtos =
                produtoRepository
                        .buscarProdutosDisponiveisParaEntrada();

        return produtos.stream()
                .map(produtoMapper::toDTO)
                .toList();
    }


    // ============================================================
    // BUSCAR POR ID
    // ============================================================

    @Transactional(readOnly = true)
    public ProdutoDTO findById(Integer id) {

        return produtoRepository.buscarPorId(id)
                .map(produtoMapper::toDTO)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Produto com ID "
                                        + id
                                        + " não encontrado"
                        )
                );
    }


    // ============================================================
    // CADASTRAR PRODUTO
    // ============================================================

    @Transactional
    public ProdutoDTO insert(ProdutoInsertDTO dto) {

        try {

            Produto produto =
                    produtoMapper.toEntity(dto);

            // Produto começa fora do estoque.
            produto.setAtivo(false);

            // Quantidade inicial sempre começa em zero.
            produto.setQuantidadeAtual(
                    BigDecimal.ZERO
            );

            produto =
                    produtoRepository.save(produto);

            return produtoMapper.toDTO(produto);

        } catch (DataIntegrityViolationException e) {

            throw new DatabaseException(
                    "Já existe um produto cadastrado com o nome "
                            + dto.nome()
            );
        }
    }


    // ============================================================
    // ATUALIZAR PRODUTO
    // ============================================================

    @Transactional
    public ProdutoDTO update(
            ProdutoUpdateDTO dto,
            Integer id
    ) {

        try {

            Produto produto =
                    produtoRepository.getReferenceById(id);

            produtoMapper.updateEntity(
                    dto,
                    produto
            );

            produto =
                    produtoRepository.save(produto);

            return produtoMapper.toDTO(produto);

        } catch (EntityNotFoundException e) {

            throw new ResourceNotFoundException(
                    "Produto com ID "
                            + id
                            + " não encontrado"
            );

        } catch (DataIntegrityViolationException e) {

            throw new DatabaseException(
                    "Já existe um produto cadastrado com o nome "
                            + dto.nome()
            );
        }
    }


    // ============================================================
    // NOVA ENTRADA NO ESTOQUE
    // ============================================================

    @Transactional
    public ProdutoDTO adicionarAoEstoque(
            Integer id,
            BigDecimal quantidade
    ) {

        if (quantidade == null ||
                quantidade.compareTo(BigDecimal.ZERO) <= 0) {

            throw new IllegalArgumentException(
                    "A quantidade deve ser maior que zero"
            );
        }

        int resultado =
                produtoRepository.adicionarEntrada(
                        id,
                        quantidade,
                        LocalDateTime.now()
                );

        if (resultado == 0) {

            throw new ResourceNotFoundException(
                    "Produto não encontrado: id "
                            + id
            );
        }

        return findById(id);
    }


    // ============================================================
    // REMOVER DO ESTOQUE
    // ============================================================

    @Transactional
    public void delete(Integer id) {

        int resultado =
                produtoRepository.desativarProduto(
                        id,
                        LocalDateTime.now()
                );

        if (resultado == 0) {

            throw new ResourceNotFoundException(
                    "Produto não encontrado no estoque: id "
                            + id
            );
        }
    }
}