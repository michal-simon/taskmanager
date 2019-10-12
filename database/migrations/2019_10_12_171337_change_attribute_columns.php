<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeAttributeColumns extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::table('product_attributes', function (Blueprint $table) {
            $table->float('minimum_downpayment')->default(0)->nullable();
            $table->float('payable_months')->default(12);
            $table->integer('number_of_years')->default(0)->nullable();
            $table->dropColumn('monthly_price');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        //
    }

}
