package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import https.github.com.fernandesdennys.dispensa.entities.Produto;
import https.github.com.fernandesdennys.dispensa.entities.enums.Unidade;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ProdutoRepository
        extends JpaRepository<Produto, Integer> {

    // ============================================================
    // PRODUTO ATIVO POR ID
    // ============================================================

    @Query("""
            SELECT p
            FROM Produto p
            JOIN FETCH p.categoria
            WHERE p.id = :id
            AND p.ativo = true
            """)
    Optional<Produto> buscarPorId(
            @Param("id") Integer id
    );


    // ============================================================
    // PRODUTOS ATIVOS DO ESTOQUE
    // ============================================================

    @Query("""
            SELECT p
            FROM Produto p
            JOIN FETCH p.categoria c
            WHERE p.ativo = true

            AND (
                :categoriaId IS NULL
                OR c.id = :categoriaId
            )

            AND (
                :abaixoMinimo = false
                OR p.quantidadeAtual < p.quantidadeMinima
            )

            AND (
                :busca IS NULL
                OR LOWER(p.nome) LIKE
                   LOWER(CONCAT('%', CAST(:busca AS string), '%'))
            )

            ORDER BY
                CASE
                    WHEN :ordenarPor = 'nome'
                    THEN p.nome
                END ASC,

                CASE
                    WHEN :ordenarPor = 'quantidade_atual'
                    THEN p.quantidadeAtual
                END ASC,

                CASE
                    WHEN :ordenarPor = 'quantidade_minima'
                    THEN p.quantidadeMinima
                END ASC,

                CASE
                    WHEN :ordenarPor = 'quantidade_ideal'
                    THEN p.quantidadeIdeal
                END ASC,

                CASE
                    WHEN :ordenarPor = 'criado_em'
                    THEN p.criadoEm
                END ASC,

                p.nome ASC
            """)
    Page<Produto> buscarProdutos(
            @Param("categoriaId") Integer categoriaId,
            @Param("abaixoMinimo") Boolean abaixoMinimo,
            @Param("busca") String busca,
            @Param("ordenarPor") String ordenarPor,
            Pageable pageable
    );


    // ============================================================
    // CATÁLOGO COMPLETO
    // ============================================================

    @Query("""
            SELECT p
            FROM Produto p
            JOIN FETCH p.categoria
            ORDER BY p.nome ASC
            """)
    List<Produto> buscarCatalogo();


    // ============================================================
    // PRODUTOS DISPONÍVEIS PARA NOVA ENTRADA
    // ============================================================

    @Query("""
            SELECT p
            FROM Produto p
            JOIN FETCH p.categoria
            WHERE p.ativo = false
            ORDER BY p.nome ASC
            """)
    List<Produto> buscarProdutosDisponiveisParaEntrada();


    // ============================================================
    // PRODUTOS ABAIXO DO MÍNIMO
    // ============================================================

    @Query("""
            SELECT p
            FROM Produto p
            WHERE p.ativo = true
            AND p.quantidadeAtual < p.quantidadeMinima
            """)
    List<Produto> buscarProdutosAbaixoDoMinimo();


    // ============================================================
    // ATUALIZAR QUANTIDADE
    // ============================================================

    @Modifying
    @Transactional
    @Query("""
            UPDATE Produto p
            SET
                p.quantidadeAtual = :quantidadeAtual,
                p.atualizadoEm = :atualizadoEm
            WHERE p.id = :id
            AND p.ativo = true
            """)
    int atualizarQuantidade(
            @Param("id") Integer id,
            @Param("quantidadeAtual") BigDecimal quantidadeAtual,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );


    // ============================================================
    // ADICIONAR ENTRADA NO ESTOQUE
    // ============================================================
    //
    // A quantidade recebida é SOMADA à quantidade existente.
    //
    // Exemplo:
    //
    // quantidadeAtual = 10
    // nova entrada    = 5
    // resultado       = 15
    //
    // O produto também é ativado novamente.
    // ============================================================

    @Modifying
    @Transactional
    @Query("""
            UPDATE Produto p
            SET
                p.ativo = true,
                p.quantidadeAtual =
                    COALESCE(p.quantidadeAtual, 0) + :quantidade,
                p.atualizadoEm = :atualizadoEm
            WHERE p.id = :id
            """)
    int adicionarEntrada(
            @Param("id") Integer id,
            @Param("quantidade") BigDecimal quantidade,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );


    // ============================================================
    // DESATIVAR PRODUTO
    // ============================================================

    @Modifying
    @Transactional
    @Query("""
            UPDATE Produto p
            SET
                p.ativo = false,
                p.atualizadoEm = :atualizadoEm
            WHERE p.id = :id
            AND p.ativo = true
            """)
    int desativarProduto(
            @Param("id") Integer id,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );


    // ============================================================
    // ATUALIZAR PRODUTO COMPLETO
    // ============================================================

    @Modifying
    @Transactional
    @Query("""
            UPDATE Produto p
            SET
                p.nome = :nome,
                p.categoria = :categoria,
                p.unidade = :unidade,
                p.quantidadeAtual = :quantidadeAtual,
                p.quantidadeMinima = :quantidadeMinima,
                p.quantidadeIdeal = :quantidadeIdeal,
                p.atualizadoEm = :atualizadoEm
            WHERE p.id = :id
            AND p.ativo = true
            """)
    int atualizarProduto(
            @Param("id") Integer id,
            @Param("nome") String nome,
            @Param("categoria") Categoria categoria,
            @Param("unidade") Unidade unidade,
            @Param("quantidadeAtual") BigDecimal quantidadeAtual,
            @Param("quantidadeMinima") BigDecimal quantidadeMinima,
            @Param("quantidadeIdeal") BigDecimal quantidadeIdeal,
            @Param("atualizadoEm") LocalDateTime atualizadoEm
    );
}