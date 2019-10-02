<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Repositories\BrandRepository;
use App\Repositories\Interfaces\BrandRepositoryInterface;
use App\Requests\CreateBrandRequest;
use App\Requests\UpdateBrandRequest;
use App\Transformations\BrandTransformable;
use Illuminate\Http\Request;
use App\Brand;

class BrandController extends Controller {
    
    use BrandTransformable;

    /**
     * @var BrandRepositoryInterface
     */
    private $brandRepo;

    /**
     * BrandController constructor.
     *
     * @param BrandRepositoryInterface $brandRepository
     */
    public function __construct(BrandRepositoryInterface $brandRepository) {
        $this->brandRepo = $brandRepository;
    }

    /**
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index(Request $request) {
        $orderBy = !$request->column ? 'name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        if (request()->has('search_term') && !empty($request->search_term)) {
            $list = $this->brandRepo->searchBrand(request()->input('search_term'));
        } else {
            $list = $this->brandRepo->listBrands(['*'], $orderBy, $orderDir);
        }

        $brands = $list->map(function (Brand $brand) {
                    return $this->transformBrand($brand);
                })->all();

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->brandRepo->paginateArrayResults($brands, $recordsPerPage);
            return $paginatedResults->toJson();
        }

        return collect($brands)->toJson();
    }

    /**
     * @param CreateBrandRequest $request
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(CreateBrandRequest $request) {
        $brandObj = $this->brandRepo->createBrand($request->all());
        $brand = $this->transformBrand($brandObj);
        return $brand->toJson();
    }

    /**
     * @param UpdateBrandRequest $request
     * @param $id
     *
     * @return \Illuminate\Http\RedirectResponse
     * @throws \App\Shop\Brands\Exceptions\UpdateBrandErrorException
     */
    public function update(UpdateBrandRequest $request, $id) {
        $brand = $this->brandRepo->findBrandById($id);
        $brandRepo = new BrandRepository($brand);
        $brandRepo->updateBrand($request->all());
    }

    /**
     * @param $id
     *
     * @return \Illuminate\Http\RedirectResponse
     * @throws \Exception
     */
    public function destroy($id) {
        $brand = $this->brandRepo->findBrandById($id);
        $brandRepo = new BrandRepository($brand);
        $brandRepo->dissociateProducts();
        $brandRepo->deleteBrand();
    }

}
