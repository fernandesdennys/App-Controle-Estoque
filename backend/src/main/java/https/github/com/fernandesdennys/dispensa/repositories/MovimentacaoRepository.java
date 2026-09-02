package https.github.com.fernandesdennys.dispensa.repositories;

import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MovimentacaoRepository
        extends JpaRepository<Movimentacao, Long> {

    // ============================================================
    // HISTÓRICO DE UM PRODUTO
    // ============================================================

    @Query("""
            SELECT m
            FROM Movimentacao m
            JOIN FETCH m.produto p
            WHERE p.id = :produtoId
            AND m.tipo = COALESCE(:tipo, m.tipo)
            ORDER BY m.criadoEm DESC
            """)
    Page<Movimentacao> buscarPorProduto(
            @Param("produtoId") Integer produtoId,
            @Param("tipo") TipoMovimentacao tipo,
            Pageable pageable
    );


    // ============================================================
    // HISTÓRICO GERAL
    //
    // Retorna movimentações de TODOS os produtos.
    // ============================================================

    @Query("""
            SELECT m
            FROM Movimentacao m
            JOIN FETCH m.produto p
            WHERE m.tipo = COALESCE(:tipo, m.tipo)
            ORDER BY m.criadoEm DESC
            """)
    Page<Movimentacao> buscarHistoricoGeral(
            @Param("tipo") TipoMovimentacao tipo,
            Pageable pageable
    );
}