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
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class WrongQuestionAdapter extends RecyclerView.Adapter<WrongQuestionAdapter.ViewHolder> {
    private List<WrongQuestionEntity> wrongQuestions;
    private Context context;

    public WrongQuestionAdapter(List<WrongQuestionEntity> wrongQuestions, Context context) {
        this.wrongQuestions = wrongQuestions;
        this.context = context;
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
        WrongQuestionEntity wrongQuestion = wrongQuestions.get(position);
        holder.tvQuestionId.setText(context.getString(R.string.question_id, wrongQuestion.questionId));
        holder.tvUserAnswer.setText(context.getString(R.string.your_answer, wrongQuestion.userAnswer));
        
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault());
        holder.tvTime.setText(context.getString(R.string.time, sdf.format(new Date(wrongQuestion.wrongTime))));
        holder.tvReviewCount.setText(context.getString(R.string.review_count, wrongQuestion.reviewCount));
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
