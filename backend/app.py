from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2

app = Flask(__name__)
CORS(app)


# PostgreSQL connection
def get_db_connection():
    return psycopg2.connect(
        host="postgres",
        database="taskflow_db",
        user="postgres",
        password="postgres"
    )


@app.route("/")
def home():
    return jsonify({
        "message": "TaskFlow Backend is running"
    })


@app.route("/health")
def health():
    try:
        conn = get_db_connection()
        conn.close()

        return jsonify({
            "status": "healthy",
            "database": "connected"
        })

    except Exception as error:
        return jsonify({
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error)
        }), 500


# GET all tasks
@app.route("/tasks", methods=["GET"])
def get_tasks():

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT id, title, status FROM tasks ORDER BY id"
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    tasks = []

    for row in rows:
        tasks.append({
            "id": row[0],
            "title": row[1],
            "status": row[2]
        })

    return jsonify(tasks)


# POST new task
@app.route("/tasks", methods=["POST"])
def create_task():

    data = request.get_json()

    if not data or not data.get("title"):
        return jsonify({
            "error": "Task title is required"
        }), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO tasks (title, status)
        VALUES (%s, %s)
        RETURNING id, title, status
        """,
        (data["title"], "Todo")
    )

    row = cursor.fetchone()

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "id": row[0],
        "title": row[1],
        "status": row[2]
    }), 201


# PUT update task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):

    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        UPDATE tasks
        SET title = COALESCE(%s, title),
            status = COALESCE(%s, status)
        WHERE id = %s
        RETURNING id, title, status
        """,
        (
            data.get("title"),
            data.get("status"),
            task_id
        )
    )

    row = cursor.fetchone()

    if row is None:
        cursor.close()
        conn.close()

        return jsonify({
            "error": "Task not found"
        }), 404

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "id": row[0],
        "title": row[1],
        "status": row[2]
    })


# DELETE task
@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM tasks WHERE id = %s RETURNING id",
        (task_id,)
    )

    row = cursor.fetchone()

    if row is None:
        cursor.close()
        conn.close()

        return jsonify({
            "error": "Task not found"
        }), 404

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({
        "message": "Task deleted successfully"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
