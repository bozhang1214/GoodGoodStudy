package com.edu.primary.ui.wrongbook;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.edu.primary.R;
import com.edu.primary.database.AppDatabase;
import com.edu.primary.database.entity.WrongQuestionEntity;
import com.edu.primary.repository.UserRepository;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.CompositeDisposable;
import io.reactivex.schedulers.Schedulers;

import java.util.ArrayList;
import java.util.List;

public class WrongBookFragment extends Fragment {
    private RecyclerView recyclerView;
    private TextView tvEmpty;
    private UserRepository userRepository;
    private AppDatabase database;
    private CompositeDisposable disposables = new CompositeDisposable();
    private WrongQuestionAdapter adapter;
    private List<WrongQuestionEntity> wrongQuestions = new ArrayList<>();

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_wrong_book, container, false);
        
        userRepository = new UserRepository(requireContext());
        database = AppDatabase.getInstance(requireContext());
        
        recyclerView = view.findViewById(R.id.recycler_view);
        tvEmpty = view.findViewById(R.id.tv_empty);

        adapter = new WrongQuestionAdapter(wrongQuestions, requireContext());
        recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        recyclerView.setAdapter(adapter);

        loadWrongQuestions();
        
        return view;
    }

    private void loadWrongQuestions() {
        long userId = userRepository.getCurrentUserId();
        if (userId == -1) {
            tvEmpty.setText(getString(R.string.please_login));
            tvEmpty.setVisibility(View.VISIBLE);
            return;
        }

        disposables.add(
            io.reactivex.Single.fromCallable(() ->
                database.wrongQuestionDao().getWrongQuestionsByUser(userId)
            )
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(
                questions -> {
                    wrongQuestions.clear();
                    wrongQuestions.addAll(questions);
                    adapter.notifyDataSetChanged();
                    
                    if (questions.isEmpty()) {
                        tvEmpty.setText(getString(R.string.no_wrong_questions));
                        tvEmpty.setVisibility(View.VISIBLE);
                        recyclerView.setVisibility(View.GONE);
                    } else {
                        tvEmpty.setVisibility(View.GONE);
                        recyclerView.setVisibility(View.VISIBLE);
                    }
                },
                error -> {
                    tvEmpty.setText(getString(R.string.load_failed, error.getMessage()));
                    tvEmpty.setVisibility(View.VISIBLE);
                }
            )
        );
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        disposables.clear();
    }
}
