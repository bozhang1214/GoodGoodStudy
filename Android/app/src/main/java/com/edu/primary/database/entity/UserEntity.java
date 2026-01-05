package com.edu.primary.database.entity;

import androidx.room.Entity;
import androidx.room.Ignore;
import androidx.room.PrimaryKey;

@Entity(tableName = "users")
public class UserEntity {
    @PrimaryKey(autoGenerate = true)
    public long id;

    public String username;
    public String password;
    public String nickname;
    public long createTime;

    public UserEntity() {
    }

    @Ignore
    public UserEntity(String username, String password, String nickname) {
        this.username = username;
        this.password = password;
        this.nickname = nickname;
        this.createTime = System.currentTimeMillis();
    }
}

