<?php

namespace App\Repositories;

use App\Task;
use App\Project;
use App\User;
use App\Repositories\UserRepository;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\Base\BaseRepository;
use App\Exceptions\CreateTaskErrorException;
use Illuminate\Support\Collection as Support;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Mail\sendEmailNotificationToAdminMailable;
use App\Mail\SendOrderToCustomerMailable;
use App\Product;
use Illuminate\Support\Facades\Mail;
use App\Events\OrderCreateEvent;
use App\Repositories\ProductRepository;

class TaskRepository extends BaseRepository implements TaskRepositoryInterface {

    /**
     * TaskRepository constructor.
     *
     * @param Task $task
     */
    public function __construct(Task $task) {
        parent::__construct($task);
        $this->model = $task;
    }

    /**
     * @param array $data
     *
     * @return Task
     * @throws CreateProjectErrorException
     */
    public function createTask(array $data): Task {
        try {
            $task = $this->create($data);
            event(new OrderCreateEvent($task));
            return $task;
        } catch (QueryException $e) {
            throw new CreateTaskErrorException($e);
        }
    }

    /**
     * Send email to customer
     */
    public function sendEmailToCustomer()
    {
//        Mail::to($this->model->customer)
//            ->send(new SendOrderToCustomerMailable($this->findTaskById($this->model->id)));        
    }

    /**
     * Send email notification to the admin
     */
    public function sendEmailNotificationToAdmin()
    {
        $userRepo = new UserRepository(new User);
        $user = $userRepo->findUserById(9874);
//        Mail::to($user)
//            ->send(new sendEmailNotificationToAdminMailable($this->findTaskById($this->model->id)));
    }

    /**
     * @param int $id
     *
     * @return Task
     * @throws \Exception
     */
    public function findTaskById(int $id): Task {
        return $this->findOneOrFail($id);
    }

    /**
     * @param array $data
     * @param int $id
     *
     * @return bool
     * @throws \Exception
     */
    public function updateTask(array $data): bool {
        return $this->update($data);
    }

    /**
     * @return bool
     * @throws \Exception
     */
    public function deleteTask(): bool {
        $result = $this->delete();
        $this->model->products()->detach();
        return $result;
    }

    /**
     * @param array $columns
     * @param string $orderBy
     * @param string $sortBy
     *
     * @return Collection
     */
    public function listTasks($columns = array('*'), string $orderBy = 'id', string $sortBy = 'asc'): Support {
        return $this->all($columns, $orderBy, $sortBy);
    }

    /**
     * 
     * @param Project $objProject
     * @param User $objUser 
     * @return type
     */
    public function getTasksForProject(Project $objProject, User $objUser = null): Support {

        $query = $this->model->join('project_task', 'tasks.id', '=', 'project_task.task_id')
                        ->select('tasks.id as id', 'tasks.*')
                        ->where('project_id', $objProject->id)
                        ->where('is_completed', 0)
                        ->where('parent_id', 0);

        if($objUser !== null) {

        }
                        

        return $query->get();
    }

    /**
     * 
     * @param int $task_type
     * @param type $limit
     * @return Support
     */
    public function getLeads($limit = null, User $objUser = null): Support {
        $query = $this->model->where('task_type', 2)
                ->where('is_completed', 0)
                ->where('parent_id', 0)
                ->orderBy('created_at', 'desc');


        if($objUser !== null) {

        }

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }
    
     public function getDeals($limit = null, User $objUser = null): Support {
        $query = $this->model->where('task_type', 3)
                ->where('is_completed', 0)
                ->where('parent_id', 0)
                ->orderBy('created_at', 'desc');

        if($objUser !== null) {

        }

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }

    /**
     * @param string $text
     * @return mixed
     */
    public function searchTask(string $text = null): Collection {
        if ($text === null) {
            return $this->all();
        }
        return $this->model->searchTask($text)->get();
    }

    /**
     * 
     * @param array $arrFilters
     * @param type $task_type
     * @return Support
     */
    public function filterTasks(array $arrFilters, $task_type): Support {

        $query = $this->model->select('tasks.id as id', 'tasks.*')
                ->leftJoin('task_user', 'tasks.id', '=', 'task_user.task_id');

        if ($task_type === 1) {
            $query = $query->join('project_task', 'tasks.id', '=', 'project_task.task_id')
                    ->where('is_completed', 0)
                    ->where('parent_id', 0);
        } else {
            $query = $query->where('is_completed', 0)
                    ->where('task_type', $task_type);
        }


        foreach ($arrFilters as $arrFilter) {
            $query->where($arrFilter['column'], '=', $arrFilter['value']);

            if (!empty($arrFilter['project_id'])) {
                $query->where('project_id', $arrFilter['project_id']);
            }

            /* whereHas('user', function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->name}%");
            }); */
        }

        return $query->get();
    }

    /**
     * Sync the products
     *
     * @param array $params
     */
    public function syncProducts(array $params) {
        return $this->model->products()->sync($params);
    }

    /**
     * Sync the users
     *
     * @param array $params
     */
    public function syncUsers(array $params) {
        return $this->model->users()->sync($params);
    }

    public function getTasksWithProducts(): Support {

        return $this->model->join('product_task', 'product_task.task_id', '=', 'tasks.id')
                        ->select('tasks.*')
                        ->groupBy('tasks.id')
                        ->get();
    }

    /**
     * 
     * @param Task $objTask
     * @return Support
     */
    public function getSubtasks(Task $objTask): Support {
        return $this->model->where('parent_id', $objTask->id)->get();
    }

    /**
     * 
     * @return type
     */
    public function getSourceTypeCounts(int $task_type): Support {
        return $this->model->join('source_type', 'source_type.id', '=', 'tasks.source_type')
                        ->select('source_type.name', DB::raw('count(*) as value'))
                        ->where('task_type', $task_type)
                        ->groupBy('source_type.name')
                        ->get();
    }

    /**
     * 
     * @return type
     */
    public function getStatusCounts(int $task_type): Support {
        return $this->model->join('task_statuses', 'task_statuses.id', '=', 'tasks.task_status')
                        ->select('task_statuses.title AS name', DB::raw('CEILING(count(*) * 100 / (select count(*) from tasks)) as value'))
                        ->where('tasks.task_type', $task_type)
                        ->groupBy('task_statuses.title')
                        ->get();
    }

    /**
     * 
     * @param int $task_type
     * @param int $number_of_days
     * @return type
     */
    public function getRecentTasks(int $task_type, int $number_of_days) {

        $date = Carbon::today()->subDays($number_of_days);
        $result = $this->model->select(DB::raw('count(*) as total'))
                ->where('created_at', '>=', $date)
                ->where('task_type', $task_type)
                ->get();

        return !empty($result[0]) ? $result[0]['total'] : 0;
    }

    /**
     * 
     * @param int $task_type
     * @return type
     */
    public function getNewDeals(int $task_type) {

        $result = $this->model->select(DB::raw('count(*) as total'))
                ->where('task_type', $task_type)
                ->get();

        return !empty($result[0]) ? $result[0]['total'] : 0;
    }

    /**
     * 
     * @param int $task_type
     * @return type
     */
    public function getTotalEarnt(int $task_type) {

        return $this->model->where('task_type', $task_type)->sum('valued_at');
    }

    /**
     * 
     * @param array $items
     * @return boolean
     */
    public function buildOrderDetails(array $items) {
        
         $this->model->products()->detach();

        foreach ($items as $item) {
            $productRepo = new ProductRepository(new Product);
            $product = $productRepo->find($item);

            $this->associateProduct($product);
        }

        return true;
    }

    /**
     * @param Product $product
     * @param int $quantity
     * @param array $data
     */
    public function associateProduct(Product $product, array $data = []) {

        $range_from = $range_to = $payable_months = $minimum_downpayment = $number_of_years = $interest_rate = 0;
        $attributes = $product->attributes->first();

        if ($attributes && $attributes->count() > 0) {
            $range_from = $attributes->range_from;
            $range_to = $attributes->range_to;
            $payable_months = $attributes->payable_months;
            $minimum_downpayment = $attributes->minimum_downpayment;
            $number_of_years = $attributes->number_of_years;
            $interest_rate = $attributes->interest_rate;
        }

        $this->model->products()->attach($product, [
            'interest_rate' => $interest_rate,
            'minimum_downpayment' => $minimum_downpayment,
            'payable_months' => $payable_months,
            'number_of_years' => $number_of_years,
            'range_from' => $range_from,
            'range_to' => $range_to,
            'name' => $product->name,
            'sku' => $product->sku,
        ]);

        return true;
    }

}
