<?php

namespace App\Http\Controllers;

use App\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\BrandRepositoryInterface;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Repositories\CategoryRepository;
use App\Requests\CreateProductRequest;
use App\Requests\UpdateProductRequest;
use App\Transformations\ProductTransformable;
use App\Transformations\LoanProductTransformable;
use Illuminate\Http\Request;
use App\Repositories\TaskRepository;
use App\Task;
use App\Requests\SearchRequest;
use App\Services\interfaces/ProductServiceInterface;

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

    private $productService;

    /**
     * ProductController constructor.
     *
     * @param ProductRepositoryInterface $productRepository
     * @param CategoryRepositoryInterface $categoryRepository
     * @param BrandRepositoryInterface $brandRepository
     */
    public function __construct(
    ProductRepositoryInterface $productRepository,
    CategoryRepositoryInterface $categoryRepository, 
    BrandRepositoryInterface $brandRepository,
    ProductServiceInterface $productService
    ) {
        $this->productRepo = $productRepository;
        $this->categoryRepo = $categoryRepository;
        $this->brandRepo = $brandRepository;
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(SearchRequest $request) {
        $products = $this->productService->search($request);
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
        $product = $this->productService->create($request);

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
        $product = $this->productService->update($request, $id);

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
        $product = $this->productService->delete($id);
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
        $list = $this->productRepo->filterProducts($request->all());
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
