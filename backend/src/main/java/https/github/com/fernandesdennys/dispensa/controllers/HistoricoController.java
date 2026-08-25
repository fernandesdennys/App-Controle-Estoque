package https.github.com.fernandesdennys.dispensa.controllers;

import https.github.com.fernandesdennys.dispensa.dtos.MovimentacaoDTO;
import https.github.com.fernandesdennys.dispensa.entities.enums.TipoMovimentacao;
import https.github.com.fernandesdennys.dispensa.services.MovimentacaoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/movimentacoes")
public class HistoricoController {

    @Autowired
    private MovimentacaoService movimentacaoService;


    // ============================================================
    // HISTÓRICO GERAL
    // ============================================================

    @GetMapping
    public ResponseEntity<Page<MovimentacaoDTO>> historico(

            @RequestParam(required = false)
            TipoMovimentacao tipo,

            @RequestParam(defaultValue = "0")
            Integer page,

            @RequestParam(defaultValue = "20")
            Integer size

    ) {

        Page<MovimentacaoDTO> resultado =
                movimentacaoService.historicoGeral(
                        tipo,
                        page,
                        size
                );

        return ResponseEntity.ok(resultado);
    }
}