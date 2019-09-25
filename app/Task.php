<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Project;
use App\Traits\SearchableTrait;
use App\Product;

class Task extends Model {

    use SearchableTrait;

    protected $fillable = [
        'title',
        'project_id',
        'content',
        'task_color',
        'contributors',
        'due_date',
        'task_status',
        'created_by',
        'task_type',
        'customer_id',
        'rating',
        'valued_at',
        'parent_id'
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
            'tasks.title' => 10,
        ]
    ];

    public function projects() {
        return $this->belongsTo(Project::class);
    }

    /**
     * @param $term
     *
     * @return mixed
     */
    public function searchTask($term) {
        return self::search($term);
    }

    public function products() {
        return $this->belongsToMany(Product::class);
    }
}
