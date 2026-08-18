package https.github.com.fernandesdennys.dispensa.dtos;

import java.math.BigDecimal;

public record ListaCompraItemDTO(

        Long id,
        Integer produtoId,
        String produtoNome,
        BigDecimal quantidadeSugerida,
        BigDecimal quantidadeComprada,
        Boolean comprado

) {
}