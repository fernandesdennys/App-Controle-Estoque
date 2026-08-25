package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoInsertDTO;
import https.github.com.fernandesdennys.dispensa.entities.Movimentacao;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MovimentacaoMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "produto", ignore = true)
    @Mapping(target = "tipo", ignore = true)
    @Mapping(target = "criadoEm", ignore = true)
    Movimentacao toEntity(MovimentacaoInsertDTO dto);

    @Mapping(target = "produtoId", source = "produto.id")
    MovimentacaoDTO toDTO(Movimentacao entity);
}