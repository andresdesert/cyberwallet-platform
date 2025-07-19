package com.cyberwallet.walletapi.repository;

import com.cyberwallet.walletapi.entity.Transaction;
import com.cyberwallet.walletapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserOrderByDateDesc(User user);

    @Query("SELECT COALESCE(SUM(t.amount),0) FROM Transaction t WHERE t.user.id = :userId AND t.type = 'TRANSFER_OUT' AND DATE(t.date) = :date")
    BigDecimal sumTransfersByUserAndDate(@Param("userId") java.util.UUID userId, @Param("date") java.time.LocalDate date);
}
