package br.com.matheusfragadev.api.infra.controller.appointment;

import br.com.matheusfragadev.api.application.appointment.AppointmentService;
import br.com.matheusfragadev.api.application.appointment.aggregate.AppointmentFilterCommand;
import br.com.matheusfragadev.api.domain.appointment.aggregate.ExamStatus;
import br.com.matheusfragadev.api.domain.appointment.aggregate.Shift;
import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import br.com.matheusfragadev.api.infra.auditory.AuditingResolver;
import br.com.matheusfragadev.api.infra.controller.appointment.aggregate.AppointmentInfo;
import br.com.matheusfragadev.api.infra.controller.appointment.aggregate.AppointmentMapper;
import br.com.matheusfragadev.api.infra.controller.appointment.aggregate.AppointmentSummary;
import br.com.matheusfragadev.api.infra.controller.appointment.aggregate.CreateAppointmentRequest;
import br.com.matheusfragadev.api.infra.security.ratelimit.RateLimited;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.v1.prefix}/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AuditingResolver auditingResolver;

    @GetMapping("/{targetId}")
    public ResponseEntity<AppointmentInfo> info(@PathVariable UUID targetId){
        var appointment = appointmentService.findById(targetId);
        var auditInfo = auditingResolver.resolve(appointment);
        var response = AppointmentMapper.toAppointInfo(appointment, auditInfo);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<AppointmentSummary>> list(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Shift shift,
            @RequestParam(required = false) ExamStatus examStatus,
            @PageableDefault(
                    size = 20,
                    sort = "createdAt",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ){
        var command = new AppointmentFilterCommand(search, shift, examStatus, pageable);
        var appointments = appointmentService.findAll(command);
        var summaries = appointments.map(AppointmentMapper::toAppointSummary);
        return ResponseEntity.ok(summaries);
    }

    @PostMapping("/schedule")
    @RateLimited(limit = 10, windowSeconds = 60)
    public ResponseEntity<UUID> create(@Valid @RequestBody CreateAppointmentRequest request){
        var command = AppointmentMapper.toAppointmentCommand(request);
        var appointmentId = appointmentService.create(command).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentId);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'RECEPTIONIST')")
    @PatchMapping("/{targetId}/attend")
    public ResponseEntity<Set<String>> attend(@PathVariable UUID targetId){
       var exams = appointmentService.attend(targetId);
       var examName = exams.stream().map(Exam::getName).collect(Collectors.toSet());
       return ResponseEntity.ok(examName);
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'NURSE')")
    @PatchMapping("/{targetId}/release")
    public ResponseEntity<Void> release(@PathVariable UUID targetId){
        appointmentService.release(targetId);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyAuthority('ADMIN', 'RECEPTIONIST')")
    @DeleteMapping("/{targetId}")
    public ResponseEntity<Void> delete(@PathVariable UUID targetId){
        appointmentService.delete(targetId);
        return ResponseEntity.noContent().build();
    }


}
