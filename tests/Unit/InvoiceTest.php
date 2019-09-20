<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace Tests\Unit;

use Tests\TestCase;
use App\Invoice;
use App\Customer;
use App\Repositories\InvoiceRepository;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Collection;

/**
 * Description of InvoiceTest
 *
 * @author michael.hampton
 */
class InvoiceTest extends TestCase {
    
    use DatabaseTransactions;
    
    private $customer;
    
     public function setUp() : void {
        parent::setUp();
        $this->beginDatabaseTransaction();
        $this->customer = factory(Customer::class)->create();
    }
    
     /** @test */
    public function it_can_show_all_the_invoices() {
        $insertedinvoice = factory(Invoice::class)->create();
        $invoiceRepo = new InvoiceRepository(new Invoice);
        $list = $invoiceRepo->listInvoices('id', 'asc')->toArray();

        $this->assertNotEmpty($list);
    }
    
    /** @test */
    public function it_can_update_the_invoice() {
        $invoice = factory(Invoice::class)->create();
        $customer_id = $this->customer->id;
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
            'customer_id' => $this->customer->id,
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
    
     /** @test */
    public function it_can_list_all_invoices() {
        factory(Invoice::class, 5)->create();
        $invoiceRepo = new InvoiceRepository(new Invoice);
        $list = $invoiceRepo->listInvoices();
        $this->assertInstanceOf(Collection::class, $list);
    }
}
