package com.edu.primary.ui.aiassistant;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.edu.primary.R;
import com.edu.primary.constants.AppConstants;
import com.edu.primary.database.entity.ChatMessageEntity;

import java.util.List;

public class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ViewHolder> {
    private List<ChatMessageEntity> messages;

    public ChatAdapter(List<ChatMessageEntity> messages) {
        this.messages = messages;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
            .inflate(R.layout.item_chat_message, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        ChatMessageEntity message = messages.get(position);
        holder.tvMessage.setText(message.content);
        
        if (AppConstants.ROLE_USER.equals(message.role)) {
            holder.itemView.setBackgroundResource(R.drawable.bg_chat_user);
            holder.tvMessage.setGravity(android.view.Gravity.END);
        } else {
            holder.itemView.setBackgroundResource(R.drawable.bg_chat_assistant);
            holder.tvMessage.setGravity(android.view.Gravity.START);
        }
    }

    @Override
    public int getItemCount() {
        return messages.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvMessage;

        ViewHolder(View itemView) {
            super(itemView);
            tvMessage = itemView.findViewById(R.id.tv_message);
        }
    }
}
