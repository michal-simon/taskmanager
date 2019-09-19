<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Permission;

class Role extends Model {

    protected $fillable = ['name', 'description'];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function permissions() {
        return $this->belongsToMany(Permission::class);
    }

    /**
     * 
     * @param type $permissions
     * @return type
     */
    public function syncPermissions(...$permissions) {
        $this->permissions()->detach();

        foreach ($permissions as $permission) {
            $this->permissions()->sync($permission, false);
        }
    }

    public function attachPermission(Permission $permission) {
        $this->permissions()->attach([$permission->id]);
    }

}
