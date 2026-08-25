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
    Produto toEntity(
            ProdutoInsertDTO dto
    );

    @Mapping(
            target = "categoriaId",
            source = "categoria.id"
    )
    ProdutoDTO toDTO(
            Produto produto
    );


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