<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\InvoiceRepositoryInterface;
use App\Notification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Event;
use App\Services\Interfaces\InvoiceServiceInterface;

class QuoteController extends Controller {

    /**
     * @var EventRepositoryInterface
     */
    private $invoiceRepository;
    
     /**
     * @var InvoiceServiceInterface
     */
    private $invoiceService;

    /**
     * ActivityController constructor.
     *
     * @param CommentRepositoryInterface $commentRepository
     * NotificationRepositoryInterface $notificationRepository
     */
    public function __construct(InvoiceRepositoryInterface $invoiceRepository, InvoiceServiceInterface $invoiceServiceInterface) {
        $this->invoiceRepository = $invoiceRepository;
        $this->invoiceService = $invoiceServiceInterface;
    }

    public function index() {
        die('here');
    }

    public function convert(int $invoice_id) {
        $invoice = $this->invoiceRepository->findInvoiceById($invoice_id);
        $clone = $this->invoiceService->convertQuote($invoice);
        return response()->json($clone);
    }

    /**
     * 
     * @param int $invoice_id
     * @return type
     */
    public function approve(int $invoice_id) {
        $invoice = $this->invoiceRepository->findInvoiceById($invoice_id);

        if ($invoice->due_date) {
            $carbonDueDate = Carbon::parse($invoice->due_date);
            if (!$carbonDueDate->isToday() && !$carbonDueDate->isFuture()) {
                return response()->json('The quote has expired');
            }
        }
        
        $this->invoiceService->approveQuote($invoice);
        return response()->json('quote approved successfully');
    }

}
