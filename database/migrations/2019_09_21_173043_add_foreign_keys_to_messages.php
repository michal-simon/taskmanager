<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddForeignKeysToMessages extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('messages', function (Blueprint $table) {
            $table->integer('user_id')->unsigned()->change();
             $table->integer('customer_id')->unsigned()->change();
             $table->foreign('customer_id')->references('id')->on('customers');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('messages', function (Blueprint $table) {
            //
        });
    }

}
