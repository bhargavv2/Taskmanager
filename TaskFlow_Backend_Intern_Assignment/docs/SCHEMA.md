# Database schema

```text
users
-----
id             PK
name           varchar(80)
email          varchar(255), unique
password_hash  varchar(255)
role           varchar(20)  [user | admin]
created_at     timestamp

       1
users -----< tasks
              id             PK
              title          varchar(120)
              description    text, nullable
              status         varchar(20)  [todo | in_progress | done]
              owner_id       FK -> users.id
              created_at     timestamp
              updated_at     timestamp
```

The `owner_id` foreign key associates each task with its creator. Normal users only see and modify their own tasks. Admins can access all tasks and view the registered-user list.
