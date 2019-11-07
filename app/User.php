<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use App\Event;
use App\Traits\SearchableTrait;
use App\Traits\HasPermissionsTrait;
use Laratrust\Traits\LaratrustUserTrait;
use App\Message;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Department;
use App\Role;
use App\Permission;

class User extends Authenticatable implements JWTSubject {

    use LaratrustUserTrait;
    use Notifiable,
        SearchableTrait,
        SoftDeletes,
        HasPermissionsTrait;

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
        'role_id',
        'job_description',
        'dob',
        'phone_number',
        'gender',
        'auth_token'
    ];
    
    private $repository =  'App\Repositories\UserRepository';

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

    public function departments() {
        return $this->belongsToMany(Department::class);
    }

    public function department_manager() {
        return $this->morphTo();
    }

    public function getJWTIdentifier() {
        return $this->getKey();
    }

    public function getJWTCustomClaims() {
        return [];
    }

    public function roles() {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    public function permissions() {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }

}
