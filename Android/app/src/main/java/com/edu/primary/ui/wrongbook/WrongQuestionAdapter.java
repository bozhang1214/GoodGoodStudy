package com.edu.primary.ui.wrongbook;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.edu.primary.R;
import com.edu.primary.database.entity.WrongQuestionEntity;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * 错题本适配器
 * 使用ViewHolder模式优化性能
 */
public class WrongQuestionAdapter extends RecyclerView.Adapter<WrongQuestionAdapter.ViewHolder> {
    private final List<WrongQuestionEntity> wrongQuestions;
    private final Context context;
    // 使用静态SimpleDateFormat避免重复创建（线程安全）
    private static final SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
    
    // 点击事件监听器
    private OnItemClickListener onItemClickListener;

    /**
     * 点击事件监听器接口
     */
    public interface OnItemClickListener {
        void onItemClick(WrongQuestionEntity wrongQuestion);
    }

    public WrongQuestionAdapter(List<WrongQuestionEntity> wrongQuestions, Context context) {
        this.wrongQuestions = wrongQuestions != null ? wrongQuestions : new ArrayList<>();
        this.context = context;
    }

    /**
     * 设置点击事件监听器
     */
    public void setOnItemClickListener(OnItemClickListener listener) {
        this.onItemClickListener = listener;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_wrong_question, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        if (position < 0 || position >= wrongQuestions.size()) {
            return;
        }
        
        WrongQuestionEntity wrongQuestion = wrongQuestions.get(position);
        if (wrongQuestion == null) {
            return;
        }
        
        holder.tvQuestionId.setText(context.getString(R.string.question_id, wrongQuestion.questionId));
        holder.tvUserAnswer.setText(context.getString(R.string.your_answer, 
            wrongQuestion.userAnswer != null ? wrongQuestion.userAnswer : ""));
        
        // 使用静态SimpleDateFormat，避免重复创建
        synchronized (sdf) {
            holder.tvTime.setText(context.getString(R.string.time, 
                sdf.format(new Date(wrongQuestion.wrongTime))));
        }
        holder.tvReviewCount.setText(context.getString(R.string.review_count, wrongQuestion.reviewCount));
        
        // 设置点击事件
        holder.itemView.setOnClickListener(v -> {
            if (onItemClickListener != null) {
                onItemClickListener.onItemClick(wrongQuestion);
            }
        });
    }

    @Override
    public int getItemCount() {
        return wrongQuestions.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvQuestionId;
        TextView tvUserAnswer;
        TextView tvTime;
        TextView tvReviewCount;

        ViewHolder(View itemView) {
            super(itemView);
            tvQuestionId = itemView.findViewById(R.id.tv_question_id);
            tvUserAnswer = itemView.findViewById(R.id.tv_user_answer);
            tvTime = itemView.findViewById(R.id.tv_time);
            tvReviewCount = itemView.findViewById(R.id.tv_review_count);
        }
    }
}
