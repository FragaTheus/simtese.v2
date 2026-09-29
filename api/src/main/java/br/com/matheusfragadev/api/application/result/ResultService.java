package br.com.matheusfragadev.api.application.result;

import br.com.matheusfragadev.api.application.appointment.AppointmentService;
import br.com.matheusfragadev.api.application.enterprise.EnterpriseService;
import br.com.matheusfragadev.api.application.filestorageservice.FileStorageService;
import br.com.matheusfragadev.api.application.result.aggregates.CreateResultCommand;
import br.com.matheusfragadev.api.application.result.aggregates.CreateResultUnlinkedCommand;
import br.com.matheusfragadev.api.application.result.aggregates.ResultFilterCommand;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.domain.result.Result;
import br.com.matheusfragadev.api.domain.result.ResultException;
import br.com.matheusfragadev.api.domain.result.ResultRepository;
import br.com.matheusfragadev.api.infra.repository.result.ResultSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.List;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class ResultService {

    private final ResultRepository repository;
    private final FileStorageService fileStorageService;
    private final AppointmentService appointmentService;
    private final EnterpriseService enterpriseService;

    @Transactional(readOnly = true)
    public Result findById(UUID targetId) {
        return repository.findById(targetId)
                .orElseThrow(() -> new ResultException("Resultado não encontrado"));
    }

    @Transactional(readOnly = true)
    public Page<Result> list(ResultFilterCommand command) {
        var spec = ResultSpec.filter(
                command.search(),
                command.apt()
        );

        return repository.findAll(spec, command.pageable());
    }

    @Transactional
    public Result create(CreateResultCommand command) {
        Appointment appointment =
                appointmentService.findById(command.appointmentId());

        String fileName = fileStorageService.save(command.file());

        try {
            Result result = Result.of(
                    appointment,
                    command.apt(),
                    fileName
            );

            return repository.save(result);

        } catch (RuntimeException e) {
            fileStorageService.delete(fileName);
            throw e;
        }
    }

    @Transactional
    public Result createUnlinked(CreateResultUnlinkedCommand command) {
        Employee employee = Employee.of(command.employeeName(), command.employeeCpf());
        Enterprise enterprise = enterpriseService.findById(command.enterpriseId());
        String fileName = fileStorageService.save(command.file());


        try {
            Result result = new Result(
                    enterprise,
                    employee,
                    command.apt(),
                    fileName
            );

            return repository.save(result);

        } catch (RuntimeException e) {
            fileStorageService.delete(fileName);
            throw e;
        }
    }

    public InputStream findFileByResultId(UUID resultId) {
        Result result = repository.findById(resultId)
                .orElseThrow(() ->
                        new ResultException("Resultado não encontrado")
                );

        return fileStorageService.find(result.getFileName());
    }

    @Transactional
    public void delete(UUID id) {
        Result result = repository.findById(id)
                .orElseThrow(() ->
                        new ResultException("Resultado não encontrado")
                );

        repository.delete(result);
        repository.flush();

        fileStorageService.delete(result.getFileName());
    }

    @Transactional(readOnly = true)
    public Page<Result> findAllByEnterpriseId(
            UUID enterpriseId,
            ResultFilterCommand command
    ) {
        var spec = ResultSpec.filterByEnterprise(
                enterpriseId,
                command.search(),
                command.apt()
        );

        return repository.findAll(
                spec,
                command.pageable()
        );
    }
}
