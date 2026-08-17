package br.com.matheusfragadev.api.application.appointment;

import br.com.matheusfragadev.api.application.appointment.aggregate.AppointmentFilterCommand;
import br.com.matheusfragadev.api.application.enterprise.EnterpriseService;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Employee;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.domain.appointment.exception.AppointmentException;
import br.com.matheusfragadev.api.domain.appointment.repository.AppointmentRepository;
import br.com.matheusfragadev.api.domain.enterprise.aggregate.CNPJ;
import br.com.matheusfragadev.api.domain.enterprise.entity.Enterprise;
import br.com.matheusfragadev.api.infra.repository.appointment.AppointmentSpec;
import br.com.matheusfragadev.api.infra.repository.appointment.aggregate.AppointmentSpecCommand;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    //Atributos da classe
    private final AppointmentRepository repository;
    private final EnterpriseService enterpriseService;


    //Metodos CRUD
    public Appointment findById(UUID targetId){
        return repository.findById(targetId).orElseThrow(() -> new AppointmentException("Agendamento não encontrado"));
    }

    public Page<Appointment> findAll(AppointmentFilterCommand command){

        var specCommand = AppointmentSpecCommand.builder()
                .search(command.search())
                .examStatus(command.examStatus())
                .shift(command.shift())
                .build();

        return repository.findAll(AppointmentSpec.appointmentFilter(specCommand), command.pageable());
    }

    public void delete(UUID targetId){
        repository.delete(findById(targetId));
    }

    //Metodos da classe
    public Appointment create(CreateAppointmentCommand command){
        Employee employee = Employee.of(command.employeeName(), command.employeeCpf());

        Enterprise enterprise = null;
        if (enterpriseService.existsByCnpj(command.enterpriseCnpj())){
            enterprise = enterpriseService.findByCnpj(command.enterpriseCnpj());
        }else{
            CNPJ cnpj = CNPJ.of(command.enterpriseCnpj());
            enterprise = new Enterprise(command.enterpriseName(), cnpj);
        }

        Appointment appointment =
                new Appointment
                        (employee, enterprise, command.shift(), command.examType(), command.exams(), command.observation());

        return repository.save(appointment);
    }

    public Appointment attend(UUID targetId){
        Appointment appointment = findById(targetId);
        appointment.attend();
        return repository.save(appointment);
    }

    public Appointment release(UUID targetId){
        Appointment appointment = findById(targetId);
        appointment.release();
        return repository.save(appointment);
    }

}
