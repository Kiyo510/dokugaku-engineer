@extends('layouts.admin')

@section('title', "ブログ記事一覧")

@section('content')
<div class="row page-heading">
    <div class="col-lg-10">
        <h1 class="">ブログ記事一覧</h1>
    </div>
</div>
<div class="row">
    <div class="col-lg-12">
        <div class="box">
            <div class="box-title">
                <h4>記事一覧</h5>
            </div>
            <div class="box-content">
                <table class="table">
                    <thead class="thead-light">
                        <tr>
                            <th>タイトル</th>
                            <th>編集</th>
                            <th>非公開</th>
                            <th>削除</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>HTML・CSSの書き方</td>
                            <td><button type=" button" class="btn btn-outline-primary btn-xs">編集</button></td>
                            <td><button type="button" class="btn btn-outline-primary btn-xs">非公開</button></td>
                            <td><button type="button" class="btn btn-outline-danger btn-xs">削除</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</div>
@endsection
