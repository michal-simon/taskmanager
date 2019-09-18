<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Task;
use App\Traits\SearchableTrait;

class Project extends Model {

    use SearchableTrait;

    protected $fillable = [
        'title',
        'description',
        'created_by',
        'customer_id'
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
            'projects.title' => 10,
        ]
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function tasks() {
        return $this->belongsToMany(Task::class);
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchProject($term) {
        return self::search($term);
    }

}
