package https.github.com.fernandesdennys.dispensa.Mapper;

import https.github.com.fernandesdennys.dispensa.entities.Categoria;
import https.github.com.fernandesdennys.dispensa.exception.ResourceNotFoundException;
import https.github.com.fernandesdennys.dispensa.repositories.CategoriaRepository;
import org.springframework.stereotype.Component;

@Component
public class CategoriaMapperHelper {

    private final CategoriaRepository categoriaRepository;

    public CategoriaMapperHelper(
            CategoriaRepository categoriaRepository
    ) {
        this.categoriaRepository = categoriaRepository;
    }

    /**
     * Converte o ID da categoria em uma entidade Categoria.
     */
    public Categoria map(Integer categoriaId) {

        if (categoriaId == null) {
            return null;
        }

        return categoriaRepository
                .findById(categoriaId)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Categoria não encontrada: id " + categoriaId
                        )
                );
    }
}