<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Traits\SearchableTrait;
use App\Task;
use App\InvoiceStatus;
use App\PaymentMethod;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model {

    use SearchableTrait,
        SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'customer_id',
        'total',
        'sub_total',
        'tax_total',
        'discount_total',
        'payment_type',
        'due_date',
        'invoice_status',
        'finance_type',
        'created_at'
    ];
    private $repository = 'App\Repositories\InvoiceRepository';

    /**
     * Searchable rules.
     *
     * @var array
     */
    protected $searchable = [
        /**
         * Columns and their priority in search results.
         * Columns with higher values are more important.
         * Columns with equal values have equal importance.
         *
         * @var array
         */
        'columns' => [
            'customers.first_name' => 10,
            'customers.last_name' => 10,
            'customers.email' => 5,
        ],
        'joins' => [
            'customers' => ['invoices.customer_id', 'customers.id'],
        ],
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function invoiceLines() {
        return $this->belongsToMany(InvoiceLine::class)
                        ->withPivot([
                            'quantity',
                            'description',
                            'unitPrice'
        ]);
    }

    public function markApproved() {
        if ($this->finance_type === 2) {
            $this->invoice_status = 4;
            $this->save();
        }
    }

    /**
     * @param $typeId
     *
     * @return bool
     */
    public function isType(int $typeId) {
        return $this->finance_type == $typeId;
    }

    public function canBePaid() {
        return !$this->isPaid() && !$this->is_deleted && $this->isStandard();
    }

    /**
     * @return bool
     */
    public function isStandard() {
        return $this->isType(1) && !$this->is_recurring;
    }

    /**
     * @return bool
     */
    public function isPaid() {
        return $this->invoice_status >= 3;
    }

    public function markSentIfUnsent() {
        if (!$this->isSent()) {
            $this->markSent();
        }
    }

    public function markSent() {
        if ($this->is_deleted) {
            return;
        }
        if (!$this->isSent()) {
            $this->invoice_status = 3;
        }
        $this->save();
        $this->markInvitationsSent();
    }

    /**
     * @param bool  $notify
     * @param mixed $reminder
     */
    public function markInvitationsSent($notify = false, $reminder = false) {
        if ($this->is_deleted) {
            return;
        }

        foreach ($this->invitations as $invitation) {
            $this->markInvitationSent($invitation, false, $notify, $reminder);
        }
    }

    /**
     * @param $invitation
     * @param bool  $messageId
     * @param bool  $notify
     * @param mixed $notes
     */
    public function markInvitationSent($invitation, $messageId = false, $notify = true, $notes = false) {
        if ($this->is_deleted) {
            return;
        }
        if (!$this->isSent()) {
            $this->invoice_status = 2;
            $this->save();
        }

        $invitation->markSent($messageId);

        // if the user marks it as sent rather than acually sending it
        // then we won't track it in the activity log
        if (!$notify) {
            return;
        }

        if ($this->isType(2)) {
            //event(new QuoteInvitationWasEmailed($invitation, $notes));
        } else {
            //event(new InvoiceInvitationWasEmailed($invitation, $notes));
        }

        return true;
    }

    public function areInvitationsSent() {
        foreach ($this->invitations as $invitation) {
            if (!$invitation->isSent()) {
                return false;
            }
        }
        return true;
    }

    /**
     * @return bool
     */
    public function isSent() {
        return $this->invoice_status >= 3;
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchInvoice($term) {
        return self::search($term);
    }

    public function tasks() {
        return $this->belongsToMany(Task::class);
    }

    public function customer() {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function invoiceStatus() {
        return $this->belongsTo(InvoiceStatus::class, 'invoice_status');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function paymentType() {
        return $this->belongsTo(PaymentMethod::class, 'payment_type');
    }

    /**
     * @return mixed
     */
    public function invitations() {
        return $this->hasMany('App\Invitation')->orderBy('invitations.customer_id');
    }

}
