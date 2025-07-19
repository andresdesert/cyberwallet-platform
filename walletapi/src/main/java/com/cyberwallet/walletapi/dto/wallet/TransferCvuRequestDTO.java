package com.cyberwallet.walletapi.dto.wallet;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransferCvuRequestDTO {
    private String targetCvu;
    private BigDecimal amount;

    public String getTargetCvu() {
        return targetCvu;
    }

    public void setTargetCvu(String targetCvu) {
        this.targetCvu = targetCvu;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
