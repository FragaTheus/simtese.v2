package br.com.matheusfragadev.api.domain.exams.repository;

import br.com.matheusfragadev.api.domain.exams.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Set;
import java.util.UUID;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID>, JpaSpecificationExecutor<Exam>{

    boolean existsByName(String name);

    @Query("""
    SELECT DISTINCT e
    FROM Appointment a
    JOIN a.exams e
    WHERE a.id = :appointmentId
    """)
    Set<Exam> findAllByAppointmentId(UUID appointmentId);
}
