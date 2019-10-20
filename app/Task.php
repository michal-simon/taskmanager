<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Project;
use App\Traits\SearchableTrait;
use App\Product;
use App\User;
use App\TaskStatus;
use App\Customer;
use App\Comment;

class Task extends Model {

    use SearchableTrait;

    protected $fillable = [
        'title',
        'project_id',
        'content',
        'contributors',
        'is_completed',
        'due_date',
        'start_date',
        'task_status',
        'created_by',
        'task_type',
        'customer_id',
        'rating',
        'valued_at',
        'parent_id',
        'source_type'
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
    
    public function users() {
        return $this->belongsToMany(User::class);
    }
    
    public function taskStatus() {
        return $this->belongsTo(TaskStatus::class, 'task_status');
    }
    
    public function customer() {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

     /**
     * Get the comments for the blog post.
     */
    public function comments()
    {
        return $this->belongsToMany(Comment::class);
    }
}
