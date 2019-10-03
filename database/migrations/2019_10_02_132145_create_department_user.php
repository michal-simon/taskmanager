<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDepartmentUser extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('department_user', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('department_id')->unsigned();
            $table->integer('user_id')->unsigned();
//            $table->foreign('user_id')->references('id')->on('users');
//            $table->foreign('department_id')->references('id')->on('departments');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::dropIfExists('department_user');
    }

}
