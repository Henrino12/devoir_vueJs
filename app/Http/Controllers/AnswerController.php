<?php
// app/Http/Controllers/AnswerController.php

namespace App\Http\Controllers;

use App\Models\Models\Answer;
use App\Models\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnswerController extends Controller
{
    /**
     * Afficher toutes les réponses pour une question donnée.
     *
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function index(Question $question)
    {
        //$answers = $question->answers()->with('user')->get();
        $question->load('answers.user');
        return response()->json( $question, 200);
    }

    /**
     * Afficher une réponse spécifique.
     *
     * @param  \App\Models\Answer  $answer
     * @return \Illuminate\Http\Response
     */
    public function show(Answer $answer)
    {
        $answer->load('user');
        return response()->json($answer, 200);
    }

    /**
     * Ajouter une nouvelle réponse à une question.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Question  $question
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, Question $question)
    {
        // Validation des données
        $request->validate([
            'content' => 'required|string',
        ]);
        $answer = new Answer([
            'content' => $request->content,
            'user_id' => Auth::id(),
        ]);

        $question->answers()->save($answer);
        $answer->load('user');

        return response()->json(['message' => 'Réponse ajoutée avec succès', 'answer' => $answer], 201);
    }

    /**
     * Mettre à jour une réponse existante.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Answer  $answer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Answer $answer)
    {
        // Vérification de l'autorisation (seul l'utilisateur qui a posté la réponse peut la modifier)
        if ($request->user()->cannot('update', $answer)) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à effectuer cette action'], 403);
        }

        // Validation des données
        $request->validate([
            'content' => 'required|string',
        ]);

        // Mise à jour de la réponse
        $answer->update([
            'content' => $request->content,
        ]);

        return response()->json(['message' => 'Réponse mise à jour avec succès', 'answer' => $answer], 200);
    }

    /**
     * Supprimer une réponse existante.
     *
     * @param  \App\Models\Answer  $answer
     * @return \Illuminate\Http\Response
     */
    public function destroy(Answer $answer)
    {
        // Vérification de l'autorisation (seul l'utilisateur qui a posté la réponse peut la supprimer)
        if (Auth::id() !== $answer->user_id) {
            return response()->json(['message' => 'Vous n\'êtes pas autorisé à effectuer cette action'], 403);
        }

        // Suppression de la réponse
        $answer->delete();

        return response()->json(['message' => 'Réponse supprimée avec succès'], 200);
    }
    /**
     * Approuver une réponse.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Answer  $answer
     * @return \Illuminate\Http\Response
     */
    public function approve(Request $request, Answer $answer)
    {
        if (Auth::user()->role !== 'superviseur') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $answer->status = 'approved';
        $answer->save();

        $user = $answer->user;
        $user->valid_answers_count++;
        $user->save();
        if ($user->valid_answers_count > 10 && $user->role !== 'superviseur') {
            $user->role = 'superviseur';
            $user->save();
        }

        return response()->json(['message' => 'Réponse approuvée avec succès', 'answer' => $answer], 200);
    }
}