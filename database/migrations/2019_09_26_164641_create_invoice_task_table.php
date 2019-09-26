<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateInvoiceTaskTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('invoice_task', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('invoice_id')->unsigned();
            $table->integer('task_id')->unsigned();
            $table->foreign('invoice_id')->references('id')->on('invoices');
            $table->foreign('task_id')->references('id')->on('tasks');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('invoice_task');
    }
}
