package br.com.matheusfragadev.api.infra.controller.appointment.aggregate;

import br.com.matheusfragadev.api.application.appointment.CreateAppointmentCommand;
import br.com.matheusfragadev.api.domain.appointment.entity.Appointment;
import br.com.matheusfragadev.api.infra.auditory.AuditInfo;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class AppointmentMapper {

    public static AppointmentInfo toAppointInfo(Appointment appointment, AuditInfo auditInfo){
        return AppointmentInfo.builder()
                .id(appointment.getId())
                .employeeName(appointment.getEmployee().getEmployeeName())
                .employeeCpf(appointment.getEmployee().getEmployeeCpf())
                .enterpriseName(appointment.getEnterprise().getName())
                .enterpriseCnpj(appointment.getEnterprise().getCnpj().getValue())
                .shift(appointment.getShift())
                .examStatus(appointment.getExamStatus())
                .examType(appointment.getExamType())
                .obs(appointment.getObservation())
                .createdBy(auditInfo.createdBy())
                .createdAt(appointment.getCreatedAt())
                .updatedBy(auditInfo.updatedBy())
                .updatedAt(appointment.getUpdatedAt())
                .build();
    }

    public static AppointmentSummary toAppointSummary(Appointment appointment){
        return AppointmentSummary.builder()
                .id(appointment.getId())
                .employeeName(appointment.getEmployee().getEmployeeName())
                .enterpriseName(appointment.getEnterprise().getName())
                .build();
    }

    public static CreateAppointmentCommand toAppointmentCommand(CreateAppointmentRequest request){
        return CreateAppointmentCommand.builder()
                .employeeName(request.employeeName())
                .employeeCpf(request.employeeCpf())
                .enterpriseName(request.enterpriseName())
                .enterpriseCnpj(request.enterpriseCnpj())
                .shift(request.shift())
                .examType(request.examType())
                .exams(request.exams())
                .observation(request.observation())
                .build();
    }

}
