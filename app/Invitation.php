<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

/**
 * Class Invitation.
 */
class Invitation extends \Illuminate\Database\Eloquent\Model {

    use SoftDeletes;

    /**
     * @var array
     */
    protected $dates = ['deleted_at'];

    /**
     * @return mixed
     */
    public function getEntityType() {
        return 3;
    }
    
    public function isSent()
    {
        return $this->sent_date && $this->sent_date != '0000-00-00 00:00:00';
    }
    
     /**
     * @param null $messageId
     */
    public function markSent($messageId = null)
    {
        $this->message_id = $messageId;
        $this->sent_date = Carbon::now()->toDateTimeString();
        $this->save();
    }

    /**
     * @return mixed
     */
    public function invoice() {
        return $this->belongsTo('App\Invoice')->withTrashed();
    }

    /**
     * @return mixed
     */
    public function customer() {
        return $this->belongsTo('App\Customer')->withTrashed();
    }

    /**
     * @return mixed
     */
    public function user() {
        return $this->belongsTo('App\User')->withTrashed();
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function brand() {
        return $this->belongsTo('App\Brand');
    }

}
