package com.mbti.question;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAllByOrderByIdAsc();
    }

    public Question getById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("题目不存在: " + id));
    }

    @Transactional
    public Question create(Question question) {
        question.getOptions().forEach(opt -> opt.setQuestion(question));
        return questionRepository.save(question);
    }

    @Transactional
    public Question update(Long id, Question updated) {
        Question question = getById(id);
        question.setText(updated.getText());
        question.setDimension(updated.getDimension());

        question.getOptions().clear();
        if (updated.getOptions() != null) {
            updated.getOptions().forEach(opt -> {
                opt.setId(null);
                opt.setQuestion(question);
                question.getOptions().add(opt);
            });
        }

        return questionRepository.save(question);
    }

    @Transactional
    public void delete(Long id) {
        questionRepository.deleteById(id);
    }

    public long getTotalCount() {
        return questionRepository.count();
    }

    public Object getStats() {
        return List.of(
            new Object[]{"EI", questionRepository.countByDimension("EI")},
            new Object[]{"SN", questionRepository.countByDimension("SN")},
            new Object[]{"TF", questionRepository.countByDimension("TF")},
            new Object[]{"JP", questionRepository.countByDimension("JP")}
        );
    }
}
