package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.entities.Produto;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(
        componentModel = "spring",
        uses = CategoriaMapperHelper.class
)
public interface ProdutoMapper {

    /*
     * ============================================================
     * DTO -> ENTIDADE
     * ============================================================
     *
     * Converte:
     *
     * ProdutoInsertDTO
     *        ↓
     * Produto
     *
     * O DTO possui categoriaId.
     *
     * A entidade possui Categoria.
     *
     * O CategoriaMapperHelper transforma o ID
     * na entidade Categoria correspondente.
     */
    @Mapping(
            target = "categoria",
            source = "categoriaId"
    )

    /*
     * O ID é gerado pelo banco.
     */
    @Mapping(
            target = "id",
            ignore = true
    )

    /*
     * O ProdutoService controla o ativo.
     */
    @Mapping(
            target = "ativo",
            ignore = true
    )

    /*
     * Controlados pelo JPA Auditing.
     */
    @Mapping(
            target = "criadoEm",
            ignore = true
    )
    @Mapping(
            target = "atualizadoEm",
            ignore = true
    )
    Produto toEntity(
            ProdutoInsertDTO dto
    );


    /*
     * ============================================================
     * ENTIDADE -> DTO
     * ============================================================
     *
     * Converte:
     *
     * Produto
     *   ↓
     * ProdutoDTO
     *
     * A entidade possui:
     *
     * categoria.id
     *
     * O DTO possui:
     *
     * categoriaId
     */
    @Mapping(
            target = "categoriaId",
            source = "categoria.id"
    )
    ProdutoDTO toDTO(
            Produto produto
    );


    /*
     * ============================================================
     * ATUALIZAR ENTIDADE
     * ============================================================
     *
     * Converte:
     *
     * ProdutoUpdateDTO
     *        ↓
     * Produto existente
     *
     * O ID nunca deve ser alterado.
     *
     * ativo também não será alterado pelo mapper.
     */
    @Mapping(
            target = "categoria",
            source = "categoriaId"
    )

    @Mapping(
            target = "id",
            ignore = true
    )

    @Mapping(
            target = "ativo",
            ignore = true
    )

    @Mapping(
            target = "criadoEm",
            ignore = true
    )

    @Mapping(
            target = "atualizadoEm",
            ignore = true
    )
    void updateEntity(
            ProdutoUpdateDTO dto,
            @MappingTarget Produto produto
    );
}