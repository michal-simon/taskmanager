<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddColumnsToProductTask extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('product_task', function (Blueprint $table) {
            $table->float('minimum_downpayment')->default(0)->nullable();
            $table->float('interest_rate')->default(0)->nullable();
            $table->float('payable_months')->default(12);
            $table->integer('number_of_years')->default(0)->nullable();
            $table->integer('range_from')->default(0)->nullable();
            $table->integer('range_to')->default(0)->nullable();
            $table->string('name')->nullable();
            $table->string('sku')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::table('product_task', function (Blueprint $table) {
            //
        });
    }

}
