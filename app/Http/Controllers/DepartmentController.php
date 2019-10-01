<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\Interfaces\PermissionRepositoryInterface;
use App\Repositories\DepartmentRepository;
use App\Repositories\Interfaces\DepartmentRepositoryInterface;
use App\Requests\CreateDepartmentRequest;
use App\Requests\UpdateDepartmentRequest;
use Illuminate\Http\Request;
use App\Department;
use App\Transformations\DepartmentTransformable;

class DepartmentController extends Controller {

    use DepartmentTransformable;

    /**
     * @var DepartmentRepositoryInterface
     */
    private $departmentRepo;

    /**
     * @var PermissionRepositoryInterface
     */
    private $permissionRepository;

    /**
     * DepartmentController constructor.
     *
     * @param DepartmentRepositoryInterface $departmentRepository
     * @param PermissionRepositoryInterface $permissionRepository
     */
    public function __construct(
    DepartmentRepositoryInterface $departmentRepository, PermissionRepositoryInterface $permissionRepository
    ) {
        $this->departmentRepo = $departmentRepository;
        $this->permissionRepository = $permissionRepository;
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index(Request $request) {

        $orderBy = !$request->column ? 'name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        if (request()->has('search_term') && !empty($request->search_term)) {
            $list = $this->departmentRepo->searchDepartment(request()->input('search_term'));
        } else {
            $list = $this->departmentRepo->listDepartments($orderBy, $orderDir);
        }

        $departments = $list->map(function (Department $department) {
                    return $this->transformDepartment($department);
                })->all();

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->departmentRepo->paginateArrayResults($departments, $recordsPerPage);
            return $paginatedResults->toJson();
        }

        return collect($departments)->toJson();
    }

    /**
     * @param CreateDepartmentRequest $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CreateDepartmentRequest $request) {
        $departmentObj = $this->departmentRepo->createDepartment($request->except('_method', '_token'));
        $department = $this->transformDepartment($departmentObj);
        return $department->toJson();
    }

    /**
     * @param $id
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function edit($id) {
        $department = $this->departmentRepo->findDepartmentById($id);
        $departmentRepo = new DepartmentRepository($department);
        $attachedPermissionsArrayIds = $departmentRepo->listPermissions()->pluck('id')->all();
        $permissions = $this->permissionRepository->listPermissions(['*'], 'name', 'asc');

        $arrData = [
            'permissions' => $permissions->toArray(),
            'department' => $department->toArray(),
            'attachedPermissions' => $attachedPermissionsArrayIds
        ];
        
        return response()->json($arrData);
    }

    /**
     * @param UpdateDepartmentRequest $request
     * @param $id
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function update(UpdateDepartmentRequest $request, $id) {
        $department = $this->departmentRepo->findDepartmentById($id);
        
        if ($request->has('permissions')) {            
            $departmentRepo = new DepartmentRepository($department);
            $departmentRepo->syncPermissions($request->input('permissions'));
        }
        
        $update = new DepartmentRepository($department);
        $data = $request->except('_method', '_token', 'permissions');
        $update->updateDepartment($data);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy($id) {

        $department = $this->departmentRepo->findDepartmentById($id);

        $departmentRepo = new DepartmentRepository($department);
        $departmentRepo->deleteDepartmentById();
        return response()->json('Customer deleted!');
    }

}
