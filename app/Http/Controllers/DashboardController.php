<?php

namespace App\Http\Controllers;

use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\Interfaces\CustomerRepositoryInterface;
use App\Transformations\TaskTransformable;
use App\Task;

class DashboardController extends Controller {
    
    use TaskTransformable;

    /**
     * @var TaskRepositoryInterface
     */
    private $taskRepository;

    /**
     * @var CustomerRepositoryInterface
     */
    private $customerRepository;

    /**
     * DashboardController constructor.
     *
     * TaskRepositoryInterface $taskRepository
     */
    public function __construct(TaskRepositoryInterface $taskRepository, CustomerRepositoryInterface $customerRepository) {
        $this->taskRepository = $taskRepository;
        $this->customerRepository = $customerRepository;
    }

    public function index() {

        $arrSources = $this->taskRepository->getSourceTypeCounts(3);
        $arrStatuses = $this->taskRepository->getStatusCounts(3);
        $leadsToday = $this->taskRepository->getRecentTasks(3, 3);
        $customersToday = $this->customerRepository->getRecentCustomers(3);
        $newDeals = $this->taskRepository->getNewDeals(3);
        $leads = $this->taskRepository->getLeads(3, 5);
        $totalEarnt = $this->taskRepository->getTotalEarnt(3);
        
         $tasks = $leads->map(function (Task $task) {
                    return $this->transformTask($task);
                })->all();
                
        $arrOutput = [
            'sources' => $arrSources->toArray(),
            'leadCounts' => $arrStatuses->toArray(),
            'totalBudget' => number_format($totalEarnt, 2),
            'totalEarnt' => number_format($totalEarnt, 2),
            'leadsToday' => number_format($leadsToday, 2),
            'newDeals' => number_format($newDeals, 2),
            'newCustomers' => number_format($customersToday, 2),
            'deals' => $tasks
        ];
//        
//        echo '<pre>';
//        print_r($arrOutput);
//        die;
        
        return response()->json($arrOutput);
    }

}
