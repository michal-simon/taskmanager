<?php

namespace App\Http\Controllers;

use App\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\BrandRepositoryInterface;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\ProductRepository;
use App\Repositories\CategoryRepository;
use App\Requests\CreateProductRequest;
use App\Requests\UpdateProductRequest;
use App\Transformations\ProductTransformable;
use App\Transformations\LoanProductTransformable;
use Illuminate\Http\Request;
use App\Repositories\TaskRepository;
use App\Task;
use Illuminate\Support\Facades\Validator;
use App\ProductAttribute;
use App\Requests\SearchRequest;

class ProductController extends Controller {

    use ProductTransformable,
        LoanProductTransformable;

    /**
     * @var ProductRepositoryInterface
     */
    private $productRepo;

    /**
     * @var CategoryRepositoryInterface
     */
    private $categoryRepo;

    /**
     * @var BrandRepositoryInterface
     */
    private $brandRepo;

    /**
     * ProductController constructor.
     *
     * @param ProductRepositoryInterface $productRepository
     * @param CategoryRepositoryInterface $categoryRepository
     * @param BrandRepositoryInterface $brandRepository
     */
    public function __construct(
    ProductRepositoryInterface $productRepository, CategoryRepositoryInterface $categoryRepository, BrandRepositoryInterface $brandRepository
    ) {
        $this->productRepo = $productRepository;
        $this->categoryRepo = $categoryRepository;
        $this->brandRepo = $brandRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(SearchRequest $request) {
        $orderBy = !$request->column ? 'name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;
        $recordsPerPage = !$request->per_page ? 0 : $request->per_page;

        if (request()->has('search_term') && !empty($request->search_term)) {            
            $list = $this->productRepo->searchProduct(request()->input('search_term'));
        } else {
            $list = $this->productRepo->listProducts($orderBy, $orderDir);
        }

        $products = $list->map(function (Product $product) {
                    return $this->transformProduct($product);
                })->all();

        if ($recordsPerPage > 0) {
            $paginatedResults = $this->productRepo->paginateArrayResults($products, $recordsPerPage);
            return $paginatedResults->toJson();
        }

        return collect($products)->toJson();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateProductRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function store(CreateProductRequest $request) {
        $data = $request->except('_token', '_method');
        $data['slug'] = str_slug($request->input('name'));

        $product = $this->productRepo->createProduct($data);

        $productRepo = new ProductRepository($product);

        if ($request->has('category')) {
            $productRepo->syncCategories($request->input('category'));
        } else {
            $productRepo->detachCategories();
        }

        return $this->transformProduct($product);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  UpdateProductRequest $request
     * @param  int $id
     *
     * @return \Illuminate\Http\Response
     * @throws \App\Shop\Products\Exceptions\ProductUpdateErrorException
     */
    public function update(UpdateProductRequest $request, int $id) {
        $product = $this->productRepo->findProductById($id);
        $productRepo = new ProductRepository($product);
        $data = $request->except(
                '_token', '_method'
        );

        $data['slug'] = str_slug($request->input('name'));

        if ($request->has('category')) {
            $productRepo->syncCategories($request->input('category'));
        } else {
            $productRepo->detachCategories();
        }

        $this->saveProductCombinations($request, $product);
        $productRepo->updateProduct($data);

        return response()->json($product);


        //return collect($products)->toJson();
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
        $product = $this->productRepo->findProductById($id);
        $productRepo = new ProductRepository($product);
        $productRepo->deleteProduct();
    }

    /**
     * 
     * @param int $task_id
     * @return type
     */
    public function getProductsForTask(int $task_id) {

        $task = (new TaskRepository(new Task))->findTaskById($task_id);

        $list = $this->productRepo->getProductsForTask($task);

        $products = $list->map(function (Product $product) {
                    return $this->transformProduct($product);
                })->all();

        return collect($products)->toJson();
    }

    /**
     * 
     * @param string $filter
     * @param int $id
     * @return type
     */
    public function filterProducts(Request $request) {

        $list = $this->productRepository->filterProducts)$request->all());
        $products = $list->map(function (Product $product) {
                    return $this->transformProduct($product);
                })->all();


        return response()->json($products);
    }

    /**
     * 
     * @param string $slug
     * @return type
     */
    public function getProduct(string $slug) {
        $product = $this->productRepo->findProductBySlug(['slug' => $slug]);
        return response()->json($product);
    }

    /**
     * @param Request $request
     * @param Product $product
     * @return boolean
     */
    private function saveProductCombinations(Request $request, Product $product): ProductAttribute {
        $fields = $request->only(
                'range_from', 'range_to', 'payable_months', 'number_of_years', 'minimum_downpayment', 'interest_rate'
        );
        if ($errors = $this->validateFields($fields)) {
            return response()->json($errors->errors(), 422);
        }

        $range_from = $fields['range_from'];
        $range_to = $fields['range_to'];
        $payable_months = $fields['payable_months'];
        $number_of_years = $fields['number_of_years'];
        $minimum_downpayment = $fields['minimum_downpayment'];
        $interest_rate = $fields['interest_rate'];

        $productRepo = new ProductRepository($product);

        $productAttributes = new ProductAttribute(compact('range_from', 'range_to', 'payable_months', 'number_of_years', 'minimum_downpayment', 'interest_rate'));

        $productRepo->removeProductAttribute($productAttributes);

        $productAttribute = $productRepo->saveProductAttributes($productAttributes);

        return $productAttribute;
    }

    /**
     * @param array $data
     *
     * @return
     */
    private function validateFields(array $data) {
        $validator = Validator::make($data, [
                    'range_from' => 'required',
                    'range_to' => 'required',
                    'payable_months' => 'required',
                    'number_of_years' => 'nullable',
                    'minimum_downpayment' => 'nullable',
                    'interest_rate' => 'required'
        ]);
        if ($validator->fails()) {
            return $validator;
        }
    }

    /**
     * 
     * @param int $id
     */
    public function getProductsForCategory(int $id, Request $request) {

        $category = $this->categoryRepo->findCategoryById($id);

        $repo = new CategoryRepository($category);
        $parentCategory = $repo->findParentCategory();

        $list = $request->has('valued_at') ? $this->productRepo->getProductsByDealValueAndCategory($category, $request) : $repo->findProducts()->where('status', 1);
        
        $products = $list->map(function (Product $product) use ($request, $parentCategory) {
                    return $this->transformLoanProduct($product, $parentCategory, $request);
                })->all();

        return response()->json(
                        [
                            'products' => $products,
                            'parent_category' => $parentCategory
                        ]
        );
    }

}
