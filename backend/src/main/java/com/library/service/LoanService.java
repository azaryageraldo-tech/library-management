package com.library.service;

import com.library.model.Loan;
import com.library.model.Book;
import com.library.repository.LoanRepository;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;
    
    @Autowired
    private BookRepository bookRepository;

    public List<Loan> getAllLoans() {
        return loanRepository.findAll();
    }

    public Optional<Loan> getLoanById(Long id) {
        return loanRepository.findById(id);
    }

    public Loan createLoan(Loan loan) {
        loan.setBorrowDate(LocalDateTime.now());
        loan.setDueDate(LocalDateTime.now().plusDays(14)); // 2 weeks loan period
        loan.setStatus("BORROWED");
        
        // Update book availability
        Book book = loan.getBook();
        book.setAvailable(false);
        bookRepository.save(book);
        
        return loanRepository.save(loan);
    }

    public Loan returnBook(Long loanId) {
        return loanRepository.findById(loanId).map(loan -> {
            loan.setReturnDate(LocalDateTime.now());
            loan.setStatus("RETURNED");
            
            // Update book availability
            Book book = loan.getBook();
            book.setAvailable(true);
            bookRepository.save(book);
            
            return loanRepository.save(loan);
        }).orElseThrow(() -> new RuntimeException("Loan not found"));
    }
}