<?php
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
class CreateTaskCommentTable extends Migration {
    /**
     * Run the migrations.
     *
     * @return void
     */
     public function up()
     {
        Schema::create('task_comment', function(Blueprint $table)
        {
            $table->increments('id');
            $table->integer('task_id')->unsigned();
            $table->integer('comment_id')->unsigned();

            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
            $table->foreign('comment_id')->references('id')->on('comments')->onDelete('cascade');
        });
    }
    
    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('invoice');
    }
}
