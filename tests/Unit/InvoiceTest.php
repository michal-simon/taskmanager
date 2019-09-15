<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Tests\Unit;

use Tests\TestCase;
use App\Invoice;
use App\Repositories\InvoiceRepository;

/**
 * Description of InvoiceTest
 *
 * @author michael.hampton
 */
class InvoiceTest extends TestCase {
    
     /** @test */
    public function it_can_show_all_the_invoices() {
        $insertedinvoice = factory(Invoice::class)->create();
        $invoiceRepo = new InvoiceRepository(new Invoice);
        $list = $invoiceRepo->listInvoices()->toArray();
        $myLastElement = end($list);
        // $this->assertInstanceOf(Collection::class, $list);
        $this->assertEquals($insertedinvoice->customer_id, $myLastElement['customer_id']);
    }
    
    /** @test */
    public function it_can_update_the_invoice() {
        $invoice = factory(Invoice::class)->create();
        $customer_id = 1;
        $data = ['customer_id' => $customer_id];
        $invoiceRepo = new InvoiceRepository($invoice);
        $updated = $invoiceRepo->updateInvoice($data);
        $found = $invoiceRepo->findInvoiceById($invoice->id);
        $this->assertTrue($updated);
        $this->assertEquals($data['customer_id'], $found->customer_id);
    }
    
    /** @test */
    public function it_can_show_the_invoice() {
        $invoice = factory(Invoice::class)->create();
        $invoiceRepo = new InvoiceRepository(new Invoice);
        $found = $invoiceRepo->findInvoiceById($invoice->id);
        $this->assertInstanceOf(Invoice::class, $found);
        $this->assertEquals($invoice->customer_id, $found->customer_id);
    }
    
     /** @test */
    public function it_can_create_a_invoice() {
        
        $data = [
            'customer_id' => 1,
            'payment_type' => 1,
            'total' => 1200,
            'invoice_status' => 1,
        ];

        $invoiceRepo = new InvoiceRepository(new Invoice);
        $invoice = $invoiceRepo->createInvoice($data);
        $this->assertInstanceOf(Invoice::class, $invoice);
        $this->assertEquals($data['customer_id'], $invoice->customer_id);
    }

    /**
     * @codeCoverageIgnore
     */
    public function it_errors_creating_the_invoice_when_required_fields_are_not_passed() {
        $this->expectException(\Illuminate\Database\QueryException::class);
        $invoice = new InvoiceRepository(new Invoice);
        $invoice->createInvoice([]);
    }

    /** @test */
    public function it_errors_finding_a_invoice() {
        $this->expectException(\Illuminate\Database\Eloquent\ModelNotFoundException::class);
        $invoice = new InvoiceRepository(new Invoice);
        $invoice->findInvoiceById(999);
    }
}
