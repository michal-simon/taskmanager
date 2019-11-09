<?php

namespace App\Services;

use App\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use App\Repositories\Interfaces\BrandRepositoryInterface;
use App\Repositories\Interfaces\CategoryRepositoryInterface;
use App\Requests\CreateProductRequest;
use App\Requests\UpdateProductRequest;
use App\Transformations\ProductTransformable;
use App\Transformations\LoanProductTransformable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\ProductAttribute;
use App\Requests\SearchRequest;
use App\Services\Interfaces\ProductServiceInterface;
use Illuminate\Http\UploadedFile;
use App\Services\EntityManager;

class ProductService implements ProductServiceInterface {

    use ProductTransformable,
        LoanProductTransformable;

    private $entityManager;

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
        $this->entityManager = new EntityManager();
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function search(SearchRequest $request) {
        $orderBy = !$request->column ? 'name' : $request->column;
        $orderDir = !$request->order ? 'asc' : $request->order;

        if (request()->has('search_term') && !empty($request->search_term)) {
            return $this->productRepo->searchProduct(request()->input('search_term'));
        }
        return $this->productRepo->listProducts($orderBy, $orderDir);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  CreateProductRequest $request
     *
     * @return \Illuminate\Http\Response
     */
    public function create(CreateProductRequest $request) {
        $data = $request->except('_token', '_method');
        $data['slug'] = str_slug($request->input('name'));

        if ($request->hasFile('cover') && $request->file('cover') instanceof UploadedFile) {
            $data['cover'] = $this->productRepo->saveCoverImage($request->file('cover'));
        }

        $product = $this->productRepo->createProduct($data);
        $productRepo = $this->entityManager::getRepository($product);
        //$productRepo = new ProductRepository($product);

        if ($request->hasFile('image')) {
            $productRepo->saveProductImages(collect($request->file('image')));
        }

        if ($request->has('category')) {
            $categories = !is_array($request->input('category')) ? explode(',', $request->input('category')) : $request->input('category');
            $productRepo->syncCategories($categories);
        } else {
            $productRepo->detachCategories();
        }

        return $product;
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
        $productRepo = $this->entityManager::getRepository($product);
        //$productRepo = new ProductRepository($product);

        $data = $request->except(
                '_token', '_method'
        );

        $data['slug'] = str_slug($request->input('name'));

        if ($request->hasFile('cover')) {
            $data['cover'] = $productRepo->saveCoverImage($request->file('cover'));
        }

        if ($request->hasFile('image')) {
            $productRepo->saveProductImages(collect($request->file('image')));
        }

        if ($request->has('category')) {
            $categories = !is_array($request->input('category')) ? explode(',', $request->input('category')) : $request->input('category');
            $productRepo->syncCategories($categories);
        } else {
            $productRepo->detachCategories();
        }

        $this->saveProductCombinations($request, $product);
        $productRepo->updateProduct($data);

        return $product;
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
    public function delete($id) {
        $product = $this->productRepo->findProductById($id);

        $product->categories()->sync([]);

        $productAttr = $product->attributes();
        /* $productAttr->each(function ($pa) {
          DB::table('attribute_value_product_attribute')->where('product_attribute_id', $pa->id)->delete();
          }); */

        $productAttr->where('product_id', $product->id)->delete();

        //$productRepo = new ProductRepository($product);
        $productRepo = $this->entityManager::getRepository($product);
        $productRepo->deleteProduct();
        return true;
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
        $productRepo = $this->entityManager::getRepository($product);
        //$productRepo = new ProductRepository($product);
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

}
