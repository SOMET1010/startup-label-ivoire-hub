
const Stats = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">L'écosystème Startup en Côte d'Ivoire</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Un secteur en pleine expansion avec un potentiel extraordinaire
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-ivoire-orange mb-2">150+</div>
            <p className="text-gray-300">Startups actives</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-ivoire-green mb-2">25+</div>
            <p className="text-gray-300">Incubateurs</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-startup-DEFAULT mb-2">5000+</div>
            <p className="text-gray-300">Emplois créés</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <div className="text-5xl font-bold text-investor-DEFAULT mb-2">15M$</div>
            <p className="text-gray-300">Investissements</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
