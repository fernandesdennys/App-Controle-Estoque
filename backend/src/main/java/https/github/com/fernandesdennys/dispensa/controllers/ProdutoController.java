package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.ProdutoDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoInsertDTO;
import https.github.com.fernandesdennys.dispensa.dtos.ProdutoUpdateDTO;
import https.github.com.fernandesdennys.dispensa.services.ProdutoService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    @GetMapping
    public ResponseEntity<Page<ProdutoDTO>> findAll(

            @RequestParam(required = false)
            Integer categoria_id,

            @RequestParam(defaultValue = "false")
            Boolean abaixo_minimo,

            @RequestParam(required = false)
            String busca,

            @RequestParam(defaultValue = "nome")
            String ordenar_por,

            @RequestParam(defaultValue = "10")
            Integer limite,

            @RequestParam(defaultValue = "0")
            Integer offset
    ) {

        if (limite <= 0) {
            limite = 10;
        }

        if (offset < 0) {
            offset = 0;
        }

        Pageable pageable =
                PageRequest.of(
                        offset / limite,
                        limite
                );

        Page<ProdutoDTO> produtos =
                produtoService.buscarProdutosPorCategoria(
                        categoria_id,
                        abaixo_minimo,
                        busca,
                        ordenar_por,
                        pageable
                );

        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/catalogo")
    public ResponseEntity<List<ProdutoDTO>> catalogo() {

        List<ProdutoDTO> produtos =
                produtoService.buscarCatalogo();

        return ResponseEntity.ok(produtos);
    }

    @GetMapping("/disponiveis")
    public ResponseEntity<List<ProdutoDTO>> disponiveis() {

        List<ProdutoDTO> produtos =
                produtoService
                        .buscarProdutosDisponiveisParaEntrada();

        return ResponseEntity.ok(produtos);
    }


    @PutMapping("/{id}/entrada")
    public ResponseEntity<ProdutoDTO> adicionarAoEstoque(

            @PathVariable Integer id,

            @RequestParam BigDecimal quantidade
    ) {

        ProdutoDTO produto =
                produtoService.adicionarAoEstoque(
                        id,
                        quantidade
                );

        return ResponseEntity.ok(produto);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProdutoDTO> findById(
            @PathVariable Integer id
    ) {

        ProdutoDTO produto =
                produtoService.findById(id);

        return ResponseEntity.ok(produto);
    }

    @PostMapping
    public ResponseEntity<ProdutoDTO> insertProduct(
            @RequestBody @Valid ProdutoInsertDTO dto
    ) {

        ProdutoDTO produto =
                produtoService.insert(dto);

        URI uri =
                ServletUriComponentsBuilder
                        .fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(produto.id())
                        .toUri();

        return ResponseEntity
                .created(uri)
                .body(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoDTO> updateProduct(
            @RequestBody @Valid ProdutoUpdateDTO dto,
            @PathVariable Integer id
    ) {

        ProdutoDTO produto =
                produtoService.update(
                        dto,
                        id
                );

        return ResponseEntity.ok(produto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable Integer id
    ) {

        produtoService.delete(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}