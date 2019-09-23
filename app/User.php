<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Event;
use App\Traits\SearchableTrait;
use Laratrust\Traits\LaratrustUserTrait;
use App\Message;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable {

    use LaratrustUserTrait;
    use Notifiable,
        SearchableTrait,
        SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'profile_photo',
        'username',
        'email',
        'password',
        'role_id'
    ];

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
            'users.first_name' => 10,
            'users.last_name' => 10,
            'users.email' => 5,
            'users.username' => 5,
        ]
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
        'created_at',
        'updated_at',
        'is_active'
    ];

    public function events() {
        return $this->belongsTo(Event::class);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function messages() {
        return $this->belongsToMany(Message::class);
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchUser($term) {
        return self::search($term);
    }

}
