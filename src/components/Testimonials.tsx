
const Testimonials = () => {
  const testimonials = [
    {
      quote: "Le Label Startup nous a permis d'économiser des ressources précieuses grâce aux exonérations fiscales, nous permettant d'investir davantage dans notre R&D.",
      author: "Marie Konan",
      role: "CEO, TechInnov",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "Depuis l'obtention du label, notre visibilité a considérablement augmenté. Nous avons été contactés par plusieurs investisseurs internationaux.",
      author: "Karim Diallo",
      role: "Fondateur, FinTech CI",
      image: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      quote: "L'accompagnement personnalisé dont nous avons bénéficié a été déterminant dans notre phase de croissance. Une vraie valeur ajoutée !",
      author: "Esther Bamba",
      role: "CTO, EduSolutions",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ils témoignent</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'expérience des startups ayant obtenu le label
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-muted/50 rounded-xl p-6 shadow-sm card-hover">
              <div className="flex items-start mb-4">
                <div className="text-4xl text-ivoire-orange">"</div>
              </div>
              <p className="text-muted-foreground mb-6 italic">{testimonial.quote}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-bold">{testimonial.author}</h4>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
